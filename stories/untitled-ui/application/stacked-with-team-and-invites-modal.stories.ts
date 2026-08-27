/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { stackedWithTeamAndInvitesModal } from "../../../src/application.ts";
import type {
  StackedWithTeamAndInvitesFeaturedMember,
  StackedWithTeamAndInvitesMember,
} from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean, selectedMemberIds: S.Array(S.String) });
type Model = typeof Model.Type;
const Shown = m("StackedWithTeamAndInvitesModalShown");
const Closed = m("StackedWithTeamAndInvitesModalClosed");
type Message =
  | Readonly<{ _tag: "AddToProject" | "Cancel" | "Dismiss" }>
  | Readonly<{ _tag: "ToggleMember"; memberId: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowTeamInvitesModal = Command.define("ShowTeamInvitesModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: 'input[type="checkbox"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseTeamInvitesModal = Command.define("CloseTeamInvitesModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const featuredMembers = [
  { avatarUrl: agentFace("Phoenix Baker"), name: "Phoenix Baker" },
  { avatarUrl: agentFace("Olivia Rhye"), name: "Olivia Rhye" },
  { avatarUrl: agentFace("Lana Steiner"), name: "Lana Steiner" },
] satisfies readonly StackedWithTeamAndInvitesFeaturedMember[];
const members = [
  {
    avatarUrl: agentFace("Candice Wu"),
    id: "candice",
    name: "Candice Wu",
    role: "Admin",
    username: "@candice",
  },
  {
    avatarUrl: agentFace("Demi Wilkinson"),
    id: "demi",
    name: "Demi Wilkinson",
    role: "Admin",
    username: "@demi",
  },
  {
    avatarUrl: agentFace("Drew Cano"),
    id: "drew",
    name: "Drew Cano",
    role: "Editor",
    username: "@drew",
  },
  {
    avatarUrl: agentFace("Natali Craig"),
    id: "natali",
    name: "Natali Crag",
    role: "Editor",
    username: "@natali",
  },
] satisfies readonly StackedWithTeamAndInvitesMember[];
const allMemberIds = members.map((member) => member.id);
const action = (tag: "AddToProject" | "Cancel" | "Dismiss"): Message => ({ _tag: tag });
const toggleMember = (memberId: string): Message => ({ _tag: "ToggleMember", memberId });

const definition = (initiallySelected: readonly string[]) => ({
  Args,
  Model,
  init: () =>
    [
      { isOpen: true, selectedMemberIds: [...initiallySelected] } satisfies Model,
      [ShowTeamInvitesModal({ selector: "#stacked-with-team-and-invites-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "ToggleMember") {
      const selected = model.selectedMemberIds.includes(next.memberId);
      return [
        {
          ...model,
          selectedMemberIds: selected
            ? model.selectedMemberIds.filter((memberId) => memberId !== next.memberId)
            : [...model.selectedMemberIds, next.memberId],
        },
        [],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "StackedWithTeamAndInvitesModalClosed" ? false : model.isOpen,
    };
    return next._tag === "AddToProject" || next._tag === "Cancel" || next._tag === "Dismiss"
      ? ([
          updated,
          [CloseTeamInvitesModal({ selector: "#stacked-with-team-and-invites-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof stackedWithTeamAndInvitesModal<Message>>[1]) =>
    stackedWithTeamAndInvitesModal(
      {
        featuredMembers,
        id: "stacked-with-team-and-invites-modal-story",
        isOpen: model.isOpen,
        members,
        onAddToProject: action("AddToProject"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onMemberToggle: toggleMember,
        selectedMemberIds: model.selectedMemberIds,
      },
      h,
    ),
});

const allSelectedDefinition = definition(allMemberIds);
const meta = componentMeta("stacked-with-team-and-invites-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Stacked With Team And Invites Modal",
};
export const Dark = {
  ...liveCommandStory({
    ...allSelectedDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [allSelectedDefinition.view(model, h)],
      ),
  }),
  args: {},
};

export const Responsive = { ...liveCommandStory(allSelectedDefinition), args: {} };

export const Interactions = {
  ...liveCommandStory(allSelectedDefinition),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Add your team members" });
    const candice = within(dialog).getByRole("checkbox", { name: "Candice Wu" });
    const demi = within(dialog).getByRole("checkbox", { name: "Demi Wilkinson" });
    await expect(candice).toHaveFocus();
    await expect(candice).toBeChecked();
    await expect(demi).toBeChecked();
    await userEvent.click(candice);
    await expect(candice).not.toBeChecked();
    await expect(demi).toBeChecked();
    await userEvent.click(candice);
    await expect(candice).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Add to project" }));
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector("#stacked-with-team-and-invites-modal-story"),
      ).toBeNull(),
    );
  },
};
