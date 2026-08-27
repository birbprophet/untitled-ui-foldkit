/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/no-length-comparison -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { userInviteModal } from "../../../src/application.ts";
import type { UserInviteMember } from "../../../src/application.ts";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const MemberId = S.Literals(["candice", "demi", "drew"]);
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  isSelectOpen: S.Boolean,
  locale: Locale,
  memberIds: S.Array(MemberId),
  selectedPersonId: S.optional(S.String),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("UserInviteModalShown");
const Closed = m("UserInviteModalClosed");
const ShowFailed = m("UserInviteModalShowFailed");
const CloseFailed = m("UserInviteModalCloseFailed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "Done" | "Open" }>
  | Readonly<{ _tag: "Focused" | "Remove" | "Selected"; id: string }>
  | Readonly<{ _tag: "SelectOpenChanged"; isOpen: boolean }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const members: Record<"candice" | "demi" | "drew", UserInviteMember> = {
  candice: {
    avatarUrl: agentFace("Candice Wu"),
    email: "candice@siglata.com",
    id: "candice",
    name: "Candice Wu",
  },
  demi: {
    email: "demi@siglata.com",
    id: "demi",
    initials: "DW",
    name: "Demi Wilkinson",
  },
  drew: {
    avatarUrl: agentFace("Drew Cano"),
    email: "drew@siglata.com",
    id: "drew",
    name: "Drew Cano",
  },
};

const personNames = [
  ["@phoenix", "Phoenix Baker"],
  ["@olivia", "Olivia Rhye"],
  ["@lana", "Lana Steiner"],
  ["@demi", "Demi Wilkinson"],
  ["@candice", "Candice Wu"],
  ["@natali", "Natali Craig"],
  ["@abraham", "Abraham Baker"],
  ["@adem", "Adem Lane"],
  ["@jackson", "Jackson Reed"],
  ["@jessie", "Jessie Meyton"],
] as const;
const people = personNames.map(([id, label]) => ({ avatarUrl: agentFace(label), id, label }));

const ShowUserInviteModal = Command.define("ShowUserInviteModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-user-invite-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseUserInviteModal = Command.define("CloseUserInviteModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (tag: "Cancel" | "Dismiss" | "Done" | "Open"): Message => ({ _tag: tag });
const idAction = (tag: "Focused" | "Remove" | "Selected", id: string): Message => ({
  _tag: tag,
  id,
});
const selectOpenChanged = (isOpen: boolean): Message => ({ _tag: "SelectOpenChanged", isOpen });

type FixtureState = "activated" | "inactive" | "partial";

const definitionWith = (state: FixtureState, showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        focusedId: "@phoenix",
        isOpen: !showTrigger,
        isSelectOpen: false,
        locale: args.locale,
        memberIds: state === "inactive" ? ["candice", "demi", "drew"] : ["demi", "drew"],
        selectedPersonId: state === "activated" ? "@olivia" : undefined,
      } satisfies Model,
      showTrigger ? [] : [ShowUserInviteModal({ selector: "#user-invite-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Focused") {
      return [{ ...model, focusedId: next.id }, []] as const;
    }
    if (next._tag === "Remove") {
      return [{ ...model, memberIds: model.memberIds.filter((id) => id !== next.id) }, []] as const;
    }
    if (next._tag === "Selected") {
      return [{ ...model, selectedPersonId: next.id }, []] as const;
    }
    if (next._tag === "SelectOpenChanged") {
      return [{ ...model, isSelectOpen: next.isOpen }, []] as const;
    }
    if (next._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowUserInviteModal({ selector: "#user-invite-modal-story" })],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "UserInviteModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Done"
      ? ([updated, [CloseUserInviteModal({ selector: "#user-invite-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof userInviteModal<Message>>[1]) =>
    h.div(
      [],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    `rounded-lg bg-bg-brand-solid px-3.5 py-2.5 text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${model.isOpen ? "opacity-0" : ""}`,
                  ),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Compartilhar com pessoas" : "Share with people"],
              ),
            ]
          : []),
        userInviteModal(
          {
            id: "user-invite-modal-story",
            isOpen: model.isOpen,
            locale: model.locale,
            members: model.memberIds.map((id) => members[id]),
            onCancel: action("Cancel"),
            onDismiss: action("Dismiss"),
            onDone: action("Done"),
            onFocusPerson: (id: string) => idAction("Focused", id),
            onRemoveMember: (id: string) => idAction("Remove", id),
            onSelectOpenChanged: selectOpenChanged,
            onSelectPerson: (id: string) => idAction("Selected", id),
            people,
            selectedPersonId: model.selectedPersonId,
          },
          h,
        ),
      ],
    ),
});

const definition = definitionWith("inactive");
const fixture = { locale: "en-US" } satisfies Args;
const meta = componentMeta("user-invite-modal");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/User Invite Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(definitionWith("activated")), args: fixture };
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
export const Responsive = { ...liveCommandStory(definition), args: { locale: "pt-BR" } };
export const Interactions = {
  ...liveCommandStory(definitionWith("inactive", true)),
  args: fixture,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Share with people" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Share with people" });
    const close = within(dialog).getByRole("button", { name: "Close dialog" });
    await expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(within(dialog).getByRole("button", { name: "Done" })).toHaveFocus();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    const selector = within(dialog).getByRole("button", { name: "Team member" });
    await expect(selector).toHaveTextContent("Select team member");
    await userEvent.click(selector);
    const intermediateOption = await page.findByRole("option", { name: /Olivia Rhye/u });
    await expect(intermediateOption).toBeVisible();
    await userEvent.click(intermediateOption);
    dialog = await page.findByRole("dialog", { name: "Share with people" });
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Team member" })).toHaveTextContent(
        "Olivia Rhye",
      ),
    );
    const removeButtons = within(dialog).getAllByRole("button", { name: "Remove" });
    await expect(removeButtons).toHaveLength(3);
    const [removeCandice] = removeButtons;
    if (removeCandice !== undefined) {
      await userEvent.click(removeCandice);
    }
    dialog = await page.findByRole("dialog", { name: "Share with people" });
    await waitFor(() => expect(dialog.querySelector('[data-member="candice"]')).toBeNull());
    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#user-invite-modal-story")).toBeNull(),
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await page.findByRole("dialog", { name: "Share with people" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await page.findByRole("dialog", { name: "Share with people" });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      '[data-modal-overlay="user-invite-modal-story"] > div[aria-hidden="true"]',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Share with people" });
    await expect(within(dialog).getByRole("button", { name: "Team member" })).toHaveTextContent(
      "Olivia Rhye",
    );
    await expect(dialog.querySelector('[data-member="candice"]')).toBeNull();
  },
};
