/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/prefer-option-over-null -- Storybook interactions and native dialog commands exercise the controlled share-project slideout. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { shareProjectMenu } from "../../../../../packages/ui/src/application/share-project-menu.ts";
import type {
  ShareProjectMenuControl,
  ShareProjectMenuPermission,
} from "../../../../../packages/ui/src/application/share-project-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Permission = S.Literals(["can-edit", "can-view", "owner"]);
const Menu = S.Literals(["", "link", "ammar", "fleur", "julius", "mathilde", "sienna"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  ammarPermission: Permission,
  fleurPermission: Permission,
  focusedPermission: Permission,
  isCopied: S.Boolean,
  isOpen: S.Boolean,
  juliusPermission: Permission,
  linkPermission: S.Literals(["can-edit", "can-view"]),
  locale: Locale,
  mathildePermission: Permission,
  openMenu: Menu,
  searchQuery: S.String,
  siennaPermission: Permission,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;

const Shown = m("ShareProjectMenuShown");
const ShowFailed = m("ShareProjectMenuShowFailed");
const Closed = m("ShareProjectMenuClosed");
const CloseFailed = m("ShareProjectMenuCloseFailed");
const PermissionFocused = m("ShareProjectMenuPermissionFocused");
const PermissionFocusFailed = m("ShareProjectMenuPermissionFocusFailed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Copy" | "Dismiss" | "Done" | "Embed" | "Open" }>
  | Readonly<{ _tag: "FocusPermission"; permission: ShareProjectMenuPermission }>
  | Readonly<{ _tag: "MenuOpen"; menu: ShareProjectMenuControl | null }>
  | Readonly<{
      _tag: "PermissionSelected";
      menu: ShareProjectMenuControl;
      permission: ShareProjectMenuPermission;
    }>
  | Readonly<{ _tag: "Search"; query: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof PermissionFocused.Type
  | typeof PermissionFocusFailed.Type;

const ShowShareProjectMenu = Command.define("ShowShareProjectMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-share-project-menu-close]" }).pipe(
      Effect.tap(() =>
        Effect.sync(() => {
          const dialog = document.querySelector<HTMLDialogElement>(selector);
          if (dialog?.localName === "dialog") {
            dialog.style.left = "auto";
          }
        }),
      ),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseShareProjectMenu = Command.define("CloseShareProjectMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const FocusShareProjectMenuPermission = Command.define("FocusShareProjectMenuPermission", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({
        onFailure: () => PermissionFocusFailed(),
        onSuccess: () => PermissionFocused(),
      }),
    ),
  messages: [PermissionFocused, PermissionFocusFailed],
});

const action = (tag: "Cancel" | "Copy" | "Dismiss" | "Done" | "Embed" | "Open"): Message => ({
  _tag: tag,
});
const focusPermission = (permission: ShareProjectMenuPermission): Message => ({
  _tag: "FocusPermission",
  permission,
});
const menuOpen = (menu: ShareProjectMenuControl | null): Message => ({ _tag: "MenuOpen", menu });
const permissionSelected = (
  menu: ShareProjectMenuControl,
  permission: ShareProjectMenuPermission,
): Message => ({ _tag: "PermissionSelected", menu, permission });
const search = (query: string): Message => ({ _tag: "Search", query });

const init = (args: Args, isOpen = true): Model => ({
  ammarPermission: "can-edit",
  fleurPermission: "can-edit",
  focusedPermission: "can-edit",
  isCopied: false,
  isOpen,
  juliusPermission: "can-edit",
  linkPermission: "can-edit",
  locale: args.locale,
  mathildePermission: "can-edit",
  openMenu: "",
  searchQuery: "",
  siennaPermission: "owner",
});

const selectedPermission = (
  model: Model,
  menu: Exclude<ShareProjectMenuControl, "link">,
): ShareProjectMenuPermission => {
  if (menu === "sienna") {
    return model.siennaPermission;
  }
  if (menu === "ammar") {
    return model.ammarPermission;
  }
  if (menu === "mathilde") {
    return model.mathildePermission;
  }
  if (menu === "julius") {
    return model.juliusPermission;
  }
  return model.fleurPermission;
};

const definition = (showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      init(args, !showTrigger),
      showTrigger ? [] : [ShowShareProjectMenu({ selector: "#share-project-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowShareProjectMenu({ selector: "#share-project-menu-story" })],
      ] as const;
    }
    if (message._tag === "Search") {
      return [{ ...model, searchQuery: message.query }, []] as const;
    }
    if (message._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    if (message._tag === "FocusPermission") {
      return [{ ...model, focusedPermission: message.permission }, []] as const;
    }
    if (message._tag === "MenuOpen") {
      if (message.menu === null) {
        return [{ ...model, openMenu: "" }, []] as const;
      }
      const focusedPermission =
        message.menu === "link" ? model.linkPermission : selectedPermission(model, message.menu);
      return [
        { ...model, focusedPermission, openMenu: message.menu },
        [
          FocusShareProjectMenuPermission({
            selector: `[data-share-project-menu-list="${message.menu}"][data-permission="${focusedPermission}"]`,
          }),
        ],
      ] as const;
    }
    if (message._tag === "PermissionSelected") {
      const next = { ...model, openMenu: "" } satisfies Model;
      if (message.menu === "link" && message.permission !== "owner") {
        return [{ ...next, linkPermission: message.permission }, []] as const;
      }
      if (message.menu === "sienna") {
        return [{ ...next, siennaPermission: message.permission }, []] as const;
      }
      if (message.menu === "ammar") {
        return [{ ...next, ammarPermission: message.permission }, []] as const;
      }
      if (message.menu === "mathilde") {
        return [{ ...next, mathildePermission: message.permission }, []] as const;
      }
      if (message.menu === "julius") {
        return [{ ...next, juliusPermission: message.permission }, []] as const;
      }
      return [{ ...next, fleurPermission: message.permission }, []] as const;
    }
    if (
      message._tag === "ShareProjectMenuClosed" ||
      message._tag === "ShareProjectMenuCloseFailed" ||
      message._tag === "ShareProjectMenuShowFailed"
    ) {
      return [{ ...model, isOpen: false, openMenu: "" }, []] as const;
    }
    if (message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Done") {
      return [model, [CloseShareProjectMenu({ selector: "#share-project-menu-story" })]] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof shareProjectMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-24")],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    model.isOpen
                      ? "pointer-events-none opacity-0"
                      : "rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.DataAttribute("share-project-menu-open", ""),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Compartilhar projeto" : "Share project"],
              ),
            ]
          : []),
        shareProjectMenu(
          {
            copied: model.isCopied,
            focusedPermission: model.focusedPermission,
            id: "share-project-menu-story",
            isOpen: model.isOpen,
            linkPermission: model.linkPermission,
            locale: model.locale,
            memberPermissions: {
              ammar: model.ammarPermission,
              fleur: model.fleurPermission,
              julius: model.juliusPermission,
              mathilde: model.mathildePermission,
              sienna: model.siennaPermission,
            },
            onCancel: action("Cancel"),
            onCopy: action("Copy"),
            onDismiss: action("Dismiss"),
            onDone: action("Done"),
            onEmbed: action("Embed"),
            onFocusPermission: focusPermission,
            onMenuOpen: menuOpen,
            onPermissionSelect: permissionSelected,
            onSearch: search,
            openMenu: model.openMenu === "" ? null : model.openMenu,
            searchQuery: model.searchQuery,
            shareUrl: "siglata.com/project/untitled",
          },
          h,
        ),
      ],
    ),
});

const enUs = { locale: "en-US" } satisfies Args;

const typeControlledSearch = async (root: HTMLElement, remaining: string): Promise<void> => {
  if (remaining === "") {
    return;
  }
  const page = within(root);
  const dialog = await page.findByRole("dialog", { name: "Slideout menu" });
  await userEvent.type(
    within(dialog).getByRole("searchbox", { name: "Search by name or email" }),
    remaining.slice(0, 1),
  );
  await typeControlledSearch(root, remaining.slice(1));
};

export default {
  ...componentMeta("share-project-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Share Project Menu",
};

export const AllVariants = { ...liveCommandStory(definition()), args: enUs };
export const States = {
  ...liveCommandStory({
    ...definition(),
    init: (args: Args) =>
      [
        {
          ...init(args),
          focusedPermission: "can-view",
          isCopied: true,
          openMenu: "link",
        } satisfies Model,
        [ShowShareProjectMenu({ selector: "#share-project-menu-story" })],
      ] as const,
  }),
  args: enUs,
};
export const Dark = {
  ...liveCommandStory({
    ...definition(),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition().view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition()), args: enUs };
export const Interactions = {
  ...liveCommandStory(definition(true)),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Share project" }, { timeout: 5000 });
    const existingDialog = page.queryByRole("dialog", { name: "Slideout menu" });
    if (existingDialog !== null) {
      await userEvent.click(
        within(existingDialog).getByRole("button", { name: "Close slideout menu" }),
      );
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"));
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });

    await expect(within(dialog).getByRole("button", { name: "Close slideout menu" })).toHaveFocus();
    await expect(within(dialog).getAllByRole("listitem")).toHaveLength(5);
    await expect(within(dialog).getByText("Fleur Cook")).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Copy" }));
    await expect(await page.findByRole("button", { name: "Copied" })).toBeVisible();
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });

    const linkHeading = within(dialog).getByText("Anyone with the link");
    await userEvent.click(within(linkHeading.parentElement ?? dialog).getByRole("button"));
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() =>
      expect(page.getByRole("menuitemradio", { name: "Can view" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Enter}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const updatedLinkHeading = within(dialog).getByText("Anyone with the link");
    await expect(
      within(updatedLinkHeading.parentElement ?? dialog).getByRole("button", { name: "can view" }),
    ).toBeVisible();

    await typeControlledSearch(canvasElement.ownerDocument.body, "Mathilde");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(
      within(dialog).getByRole("searchbox", { name: "Search by name or email" }),
    ).toHaveValue("Mathilde");

    const ammarRow = within(dialog).getByText("Ammar Foley").closest("li");
    await expect(ammarRow).not.toBeNull();
    await userEvent.click(within(ammarRow ?? dialog).getByRole("button", { name: "Can edit" }));
    await userEvent.keyboard("{Home}");
    await waitFor(() => expect(page.getByRole("menuitemradio", { name: "Owner" })).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const updatedAmmarRow = within(dialog).getByText("Ammar Foley").closest("li");
    await expect(updatedAmmarRow).not.toBeNull();
    await expect(
      within(updatedAmmarRow ?? dialog).getByRole("button", { name: "Owner" }),
    ).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      "[data-share-project-menu-backdrop]",
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 5000 });
    const finalLinkHeading = within(dialog).getByText("Anyone with the link");
    await userEvent.click(within(finalLinkHeading.parentElement ?? dialog).getByRole("button"));
    await expect(await page.findByRole("menu")).toBeVisible();
  },
};
