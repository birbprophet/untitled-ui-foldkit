/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { emailInviteModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ emails: S.Array(S.String), isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("EmailInviteModalShown");
const Closed = m("EmailInviteModalClosed");
type Message =
  | Readonly<{ _tag: "AddAnother" | "Cancel" | "Dismiss" | "SendInvites" }>
  | Readonly<{ _tag: "EmailInput"; index: number; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowEmailInviteModal = Command.define("ShowEmailInviteModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseEmailInviteModal = Command.define("CloseEmailInviteModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "AddAnother" | "Cancel" | "Dismiss" | "SendInvites"): Message => ({
  _tag: tag,
});
const emailInput = (index: number, emailValue: string): Message => ({
  _tag: "EmailInput",
  index,
  value: emailValue,
});

const definition = {
  Args,
  Model,
  init: () =>
    [
      { emails: ["", ""], isOpen: true } satisfies Model,
      [ShowEmailInviteModal({ selector: "#email-invite-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "EmailInput") {
      return [
        {
          ...model,
          emails: model.emails.map((email, index) => (index === next.index ? next.value : email)),
        },
        [],
      ] as const;
    }
    if (next._tag === "AddAnother") {
      return [{ ...model, emails: [...model.emails, ""] }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "EmailInviteModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "SendInvites"
      ? ([updated, [CloseEmailInviteModal({ selector: "#email-invite-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof emailInviteModal<Message>>[1]) =>
    emailInviteModal(
      {
        emails: model.emails,
        id: "email-invite-modal-story",
        isOpen: model.isOpen,
        onAddAnother: action("AddAnother"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onEmailInput: emailInput,
        onSendInvites: action("SendInvites"),
      },
      h,
    ),
};

const meta = componentMeta("email-invite-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Email Invite Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Invite collaborators" });
    const firstField = within(dialog).getByRole("textbox", { name: /Email address/u });
    await userEvent.type(firstField, "olivia@example.com");
    await expect(firstField).toHaveValue("olivia@example.com");
    await userEvent.click(within(dialog).getByRole("button", { name: "Add another" }));
    await waitFor(() => expect(within(dialog).getAllByRole("textbox")).toHaveLength(3));
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#email-invite-modal-story")).toBeNull(),
    );
  },
};
