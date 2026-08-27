/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import {
  projectDetailsMembers,
  projectDetailsMenu,
} from "../../../src/application/project-details-menu.ts";
import type {
  ProjectDetailsMemberId,
  ProjectDetailsStatus,
} from "../../../src/application/project-details-menu.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { agentFace } from "../../fixtures/brand.ts";
import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const MemberId = S.Literals(["candice-wu", "demi-wilkinson", "drew-cano"]);
const Status = S.Literals(["cancelled", "completed", "draft", "in-progress"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  description: S.String,
  isCopied: S.Boolean,
  isOpen: S.Boolean,
  isStatusOpen: S.Boolean,
  locale: Locale,
  memberIds: S.Array(MemberId),
  name: S.String,
  selectedStatus: Status,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type MemberId = typeof MemberId.Type;

const Shown = m("ProjectDetailsMenuShown");
const Closed = m("ProjectDetailsMenuClosed");
const ShowFailed = m("ProjectDetailsMenuShowFailed");
const CloseFailed = m("ProjectDetailsMenuCloseFailed");
type Message =
  | Readonly<{
      _tag: "AddTeamMember" | "Apply" | "Cancel" | "Copy" | "Dismiss" | "Open" | "SaveFilter";
    }>
  | Readonly<{ _tag: "DescriptionInput" | "NameInput"; fieldValue: string }>
  | Readonly<{ _tag: "RemoveMember"; id: MemberId }>
  | Readonly<{ _tag: "StatusFocus" | "StatusSelect"; status: ProjectDetailsStatus }>
  | Readonly<{ _tag: "StatusOpenChanged"; isOpen: boolean }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const ShowProjectDetailsMenu = Command.define("ShowProjectDetailsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-project-details-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseProjectDetailsMenu = Command.define("CloseProjectDetailsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const action = (
  tag: "AddTeamMember" | "Apply" | "Cancel" | "Copy" | "Dismiss" | "Open" | "SaveFilter",
): Message => ({ _tag: tag });
const inputAction = (tag: "DescriptionInput" | "NameInput", fieldValue: string): Message => ({
  _tag: tag,
  fieldValue,
});
const removeMember = (id: ProjectDetailsMemberId): Message => ({ _tag: "RemoveMember", id });
const statusAction = (
  tag: "StatusFocus" | "StatusSelect",
  status: ProjectDetailsStatus,
): Message => ({ _tag: tag, status });
const statusOpenChanged = (isOpen: boolean): Message => ({
  _tag: "StatusOpenChanged",
  isOpen,
});

const definitionWith = (state: "copied" | "default", initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        description: "A little about the company and the team that you'll be working with.",
        isCopied: state === "copied",
        isOpen: initiallyOpen,
        isStatusOpen: false,
        locale: args.locale,
        memberIds: projectDetailsMembers.map(({ id }) => id),
        name: "Marketing site redesign",
        selectedStatus: "in-progress",
      } satisfies Model,
      initiallyOpen ? [ShowProjectDetailsMenu({ selector: "#project-details-menu-story" })] : [],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    if (message._tag === "NameInput") {
      return [{ ...model, name: message.fieldValue }, []] as const;
    }
    if (message._tag === "DescriptionInput") {
      return [{ ...model, description: message.fieldValue }, []] as const;
    }
    if (message._tag === "RemoveMember") {
      return [
        { ...model, memberIds: model.memberIds.filter((id) => id !== message.id) },
        [],
      ] as const;
    }
    if (message._tag === "StatusOpenChanged") {
      return [{ ...model, isStatusOpen: message.isOpen }, []] as const;
    }
    if (message._tag === "StatusSelect") {
      return [{ ...model, isStatusOpen: false, selectedStatus: message.status }, []] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowProjectDetailsMenu({ selector: "#project-details-menu-story" })],
      ] as const;
    }
    if (message._tag === "Apply" || message._tag === "Cancel" || message._tag === "Dismiss") {
      return [
        model,
        [CloseProjectDetailsMenu({ selector: "#project-details-menu-story" })],
      ] as const;
    }
    if (message._tag === "ProjectDetailsMenuClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (message._tag === "ProjectDetailsMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof projectDetailsMenu<Message>>[1]) =>
    projectDetailsMenu(
      {
        avatars: {
          "candice-wu": agentFace("Candice Wu"),
          "demi-wilkinson": agentFace("Demi Wilkinson"),
          "drew-cano": agentFace("Drew Cano"),
        },
        copied: model.isCopied,
        description: model.description,
        heading: "Marketing site redesign",
        id: "project-details-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        members: projectDetailsMembers.filter(({ id }) => model.memberIds.includes(id)),
        name: model.name,
        onAddTeamMember: action("AddTeamMember"),
        onApply: action("Apply"),
        onCancel: action("Cancel"),
        onCopy: action("Copy"),
        onDescriptionInput: (value) => inputAction("DescriptionInput", value),
        onDismiss: action("Dismiss"),
        onNameInput: (value) => inputAction("NameInput", value),
        onRemoveMember: removeMember,
        onSaveFilter: action("SaveFilter"),
        onStatusFocus: (status) => statusAction("StatusFocus", status),
        onStatusOpenChanged: statusOpenChanged,
        onStatusSelect: (status) => statusAction("StatusSelect", status),
        selectedStatus: model.selectedStatus,
        shareUrl: "siglata.com/project/marketing-site",
        subtitle: "Redesign of siglata.com",
      },
      h,
    ),
});

const definition = definitionWith("default");
const interactiveDefinition = {
  ...definitionWith("default", false),
  view: (model: Model, h: Parameters<typeof projectDetailsMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-dvh bg-bg-primary")],
      [
        h.button(
          [
            h.Class(
              "fixed top-4 right-4 rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            ),
            h.DataAttribute("project-details-menu-trigger", ""),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          ["Open project details"],
        ),
        definition.view(model, h),
      ],
    ),
};

const enUs = { locale: "en-US" } satisfies Args;
export default {
  ...componentMeta("project-details-menu"),
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Project Details Menu",
};

export const AllVariants = { ...liveCommandStory(definition), args: enUs };
export const States = { ...liveCommandStory(definitionWith("copied")), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition), args: enUs };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open project details" });
    const currentMenu = async () =>
      await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 15_000 });

    await userEvent.click(trigger);
    let menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(menu.contains(canvasElement.ownerDocument.activeElement)).toBe(true);

    const copyLink = within(menu).queryByRole("button", { name: "Copy link" });
    if (copyLink !== null) {
      await userEvent.click(copyLink);
    }
    await waitFor(async () => {
      menu = await currentMenu();
      await expect(within(menu).getByRole("button", { name: "Copied" })).toBeVisible();
    });

    const name = within(menu).getByRole("textbox", { name: /Name of project/u });
    await userEvent.clear(name);
    await userEvent.type(name, "Website redesign");
    await waitFor(() => expect(within(menu).getByDisplayValue("Website redesign")).toBeVisible());

    const description = within(menu).getByRole("textbox", { name: "Description" });
    await userEvent.clear(description);
    await userEvent.type(description, "A public description of the refreshed Siglata site.");
    await waitFor(() =>
      expect(
        within(menu).getByDisplayValue("A public description of the refreshed Siglata site."),
      ).toBeVisible(),
    );

    await userEvent.click(within(menu).getByRole("button", { name: /Project status/u }));
    await userEvent.click(within(menu).getByRole("option", { name: "Completed" }));
    await waitFor(() =>
      expect(within(menu).getByRole("button", { name: "Project status" })).toHaveTextContent(
        "Completed",
      ),
    );

    menu = await currentMenu();
    const candice = within(menu).queryByText("Candice Wu")?.closest("figure");
    if (candice !== undefined && candice !== null) {
      const row = candice.parentElement;
      if (row !== null) {
        await userEvent.click(within(row).getByRole("button", { name: "Remove" }));
      }
    }
    await waitFor(async () => {
      menu = await currentMenu();
      await expect(within(menu).queryByText("Candice Wu")).toBeNull();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    menu = await currentMenu();
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-project-details-menu-overlay="project-details-menu-story"] > button',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(menu).getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(within(menu).getByDisplayValue("Website redesign")).toBeVisible();
    await expect(within(menu).getByRole("button", { name: "Project status" })).toHaveTextContent(
      "Completed",
    );
    await expect(within(menu).queryByText("Candice Wu")).toBeNull();
  },
};
