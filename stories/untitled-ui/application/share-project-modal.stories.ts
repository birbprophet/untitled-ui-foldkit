/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/prefer-option-over-null -- Storybook interactions and native dialog commands use browser APIs; null mirrors the component's controlled closed-menu value. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { shareProjectModal } from "../../../src/application.ts";
import type { ShareProjectMenu, ShareProjectPermission } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Permission = S.Literals(["can-edit", "can-view", "owner"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  ammarPermission: Permission,
  focusedPermission: Permission,
  isCopied: S.Boolean,
  isOpen: S.Boolean,
  linkPermission: S.Literals(["can-edit", "can-view"]),
  locale: Locale,
  mathildePermission: Permission,
  openMenu: S.Literals(["", "link", "ammar", "mathilde", "sienna"]),
  searchQuery: S.String,
  siennaPermission: Permission,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("ShareProjectDialogShown");
const DialogClosed = m("ShareProjectDialogClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Copy" | "Dismiss" | "Done" | "Embed" }>
  | Readonly<{ _tag: "FocusPermission"; permission: ShareProjectPermission }>
  | Readonly<{ _tag: "MenuOpen"; menu: ShareProjectMenu | null }>
  | Readonly<{
      _tag: "PermissionSelected";
      menu: ShareProjectMenu;
      permission: ShareProjectPermission;
    }>
  | Readonly<{ _tag: "Search"; query: string }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowShareProjectDialog = Command.define("ShowShareProjectDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-share-project-close]" }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseShareProjectDialog = Command.define("CloseShareProjectDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const action = (tag: "Cancel" | "Copy" | "Dismiss" | "Done" | "Embed"): Message => ({
  _tag: tag,
});
const focusPermission = (permission: ShareProjectPermission): Message => ({
  _tag: "FocusPermission",
  permission,
});
const menuOpen = (menu: ShareProjectMenu | null): Message => ({ _tag: "MenuOpen", menu });
const permissionSelected = (
  menu: ShareProjectMenu,
  permission: ShareProjectPermission,
): Message => ({ _tag: "PermissionSelected", menu, permission });
const search = (query: string): Message => ({ _tag: "Search", query });

const init = (args: Args): Model => ({
  ammarPermission: "can-edit",
  focusedPermission: "can-edit",
  isCopied: false,
  isOpen: true,
  linkPermission: "can-edit",
  locale: args.locale,
  mathildePermission: "can-edit",
  openMenu: "",
  searchQuery: "",
  siennaPermission: "owner",
});

const members = [
  {
    avatarUrl: agentFace("Sienna Hewitt"),
    email: "sienna@siglata.com",
    id: "sienna",
    isOnline: true,
    name: "Sienna Hewitt",
  },
  {
    avatarUrl: agentFace("Ammar Foley"),
    email: "ammar@siglata.com",
    id: "ammar",
    isOnline: false,
    name: "Ammar Foley",
  },
  {
    avatarUrl: agentFace("Mathilde Lewis"),
    email: "mathilde@siglata.com",
    id: "mathilde",
    isOnline: false,
    name: "Mathilde Lewis",
  },
] as const;

const fixture = { locale: "en-US" } satisfies Args;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [init(args), [ShowShareProjectDialog({ selector: "#share-project-modal-story" })]] as const,
  update: (model: Model, message: Message) => {
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
      if (message.menu === "link") {
        return [
          { ...model, focusedPermission: model.linkPermission, openMenu: message.menu },
          [],
        ] as const;
      }
      if (message.menu === "sienna") {
        return [
          { ...model, focusedPermission: model.siennaPermission, openMenu: message.menu },
          [],
        ] as const;
      }
      if (message.menu === "ammar") {
        return [
          { ...model, focusedPermission: model.ammarPermission, openMenu: message.menu },
          [],
        ] as const;
      }
      return [
        { ...model, focusedPermission: model.mathildePermission, openMenu: message.menu },
        [],
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
      return [{ ...next, mathildePermission: message.permission }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: message._tag === "ShareProjectDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Done"
      ? ([updated, [CloseShareProjectDialog({ selector: "#share-project-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof shareProjectModal<Message>>[1]) =>
    shareProjectModal(
      {
        copied: model.isCopied,
        focusedPermission: model.focusedPermission,
        id: "share-project-modal-story",
        isOpen: model.isOpen,
        linkPermission: model.linkPermission,
        locale: model.locale,
        memberPermissions: {
          ammar: model.ammarPermission,
          mathilde: model.mathildePermission,
          sienna: model.siennaPermission,
        },
        members,

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
};
export default {
  ...componentMeta("share-project-modal"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Share Project Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = {
  ...liveCommandStory({
    ...definition,
    init: (args: Args) =>
      [
        {
          ...init(args),
          focusedPermission: "can-view",
          isCopied: true,
          openMenu: "link",
        } satisfies Model,
        [ShowShareProjectDialog({ selector: "#share-project-modal-story" })],
      ] as const,
  }),
  args: fixture,
};
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Share this project" });
    await expect(dialog).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Copy" }));
    await expect(await page.findByRole("button", { name: "Copied" })).toBeVisible();
    dialog = await page.findByRole("dialog", { name: "Share this project" });

    const linkHeading = within(dialog).getByText("Anyone with the link");
    const linkControls = within(linkHeading.parentElement ?? dialog);
    await userEvent.click(linkControls.getByRole("button", { name: "can edit" }));
    await userEvent.keyboard("{ArrowUp}{Enter}");
    dialog = await page.findByRole("dialog", { name: "Share this project" });
    const updatedLinkHeading = within(dialog).getByText("Anyone with the link");
    await expect(
      within(updatedLinkHeading.parentElement ?? dialog).getByRole("button", {
        name: "can view",
      }),
    ).toBeVisible();

    const searchInput = within(dialog).getByRole("searchbox", {
      name: "Search by name or email",
    });
    await userEvent.click(searchInput);
    const typeControlledSearch = async (remaining: string): Promise<void> => {
      if (remaining === "") {
        return;
      }
      const currentDialog = await page.findByRole("dialog", { name: "Share this project" });
      await userEvent.type(
        within(currentDialog).getByRole("searchbox", { name: "Search by name or email" }),
        remaining.slice(0, 1),
      );
      await typeControlledSearch(remaining.slice(1));
    };
    await typeControlledSearch("Mathilde");
    dialog = await page.findByRole("dialog", { name: "Share this project" });
    await expect(
      within(dialog).getByRole("searchbox", { name: "Search by name or email" }),
    ).toHaveValue("Mathilde");
    await expect(within(dialog).getByText("Mathilde Lewis")).toBeVisible();
    await expect(within(dialog).getByText("Sienna Hewitt")).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
