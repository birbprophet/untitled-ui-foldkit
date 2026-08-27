/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { accessRequestModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({
  avatarSeed: S.String,
  projectName: S.String,
  requesterEmail: S.String,
  requesterFirstName: S.String,
  requesterName: S.String,
});
const Model = S.Struct({
  avatarSeed: S.String,
  isOpen: S.Boolean,
  projectName: S.String,
  requesterEmail: S.String,
  requesterFirstName: S.String,
  requesterName: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("DialogShown");
const DialogClosed = m("DialogClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;
const cancel: Message = { _tag: "Cancel" };
const confirm: Message = { _tag: "Confirm" };

const ShowAccessRequestDialog = Command.define("ShowAccessRequestDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseAccessRequestDialog = Command.define("CloseAccessRequestDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const fixture = {
  avatarSeed: "candice-wu-access-request",
  projectName: "Marketing Website Design",
  requesterEmail: "candice@siglata.com",
  requesterFirstName: "Candice",
  requesterName: "Candice Wu",
} satisfies Args;

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (args: Args): Model => ({ ...args, isOpen: initiallyOpen }),
  update: (model: Model, message: Message): Model => ({
    ...model,
    isOpen: message._tag === "DialogClosed" ? false : model.isOpen,
  }),
  view: (model: Model, h: Parameters<typeof accessRequestModal<Message>>[1]) =>
    accessRequestModal(
      {
        avatarSeed: model.avatarSeed,
        id: "access-request-modal-story",
        isOpen: model.isOpen,
        onCancel: cancel,
        onConfirm: confirm,
        projectName: model.projectName,
        requesterEmail: model.requesterEmail,
        requesterFirstName: model.requesterFirstName,
        requesterName: model.requesterName,
      },
      h,
    ),
});

const interactiveDefinition = {
  ...definition(true),
  init: (args: Args) =>
    [
      definition(true).init(args),
      [ShowAccessRequestDialog({ selector: "#access-request-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    const next = definition(true).update(model, message);
    return message._tag === "Cancel" || message._tag === "Confirm"
      ? ([next, [CloseAccessRequestDialog({ selector: "#access-request-modal-story" })]] as const)
      : ([next, []] as const);
  },
};

export default {
  ...componentMeta("access-request-modal"),
  title: "Untitled UI/Application/Access Request Modal",
};

export const AllVariants = { ...liveCommandStory(interactiveDefinition), args: fixture };

export const Dark = {
  ...liveCommandStory({
    ...interactiveDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition(true).view(model, h)],
      ),
  }),
  args: fixture,
};

export const Responsive = { ...liveCommandStory(interactiveDefinition), args: fixture };

export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", {
      name: "Candice has requested edit access",
    });
    await expect(dialog).toBeVisible();
    const close = await canvas.findByRole("button", { name: "Close dialog" });
    await expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(await canvas.findByRole("button", { name: "Confirm" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
