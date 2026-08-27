/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { checkboxesModal } from "../../../src/application.ts";
import type { CheckboxesModalChannel } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Channel = S.Literals(["facebook", "medium", "twitter"]);
const Model = S.Struct({ isOpen: S.Boolean, selectedChannels: S.Array(Channel) });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("CheckboxesDialogShown");
const DialogClosed = m("CheckboxesDialogClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "Toggle"; channel: CheckboxesModalChannel }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowCheckboxesDialog = Command.define("ShowCheckboxesDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseCheckboxesDialog = Command.define("CloseCheckboxesDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const simple = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });

const definitionWith = (selectedChannels: readonly CheckboxesModalChannel[]) => ({
  Args,
  Model,
  init: (_args: Args) =>
    [
      { isOpen: true, selectedChannels: [...selectedChannels] } satisfies Model,
      [ShowCheckboxesDialog({ selector: "#checkboxes-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Toggle") {
      const selected = model.selectedChannels.includes(message.channel);
      return [
        {
          ...model,
          selectedChannels: selected
            ? model.selectedChannels.filter((channel) => channel !== message.channel)
            : [...model.selectedChannels, message.channel],
        },
        [],
      ] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "CheckboxesDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss"
      ? ([next, [CloseCheckboxesDialog({ selector: "#checkboxes-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof checkboxesModal<Message>>[1]) =>
    checkboxesModal(
      {
        id: "checkboxes-modal-story",
        isOpen: model.isOpen,
        messageForToggle: (channel) => ({ _tag: "Toggle", channel }) satisfies Message,
        onCancel: simple("Cancel"),
        onConfirm: simple("Confirm"),
        onDismiss: simple("Dismiss"),
        selectedChannels: model.selectedChannels,
      },
      h,
    ),
});

const fixture = {} satisfies Args;
const definition = definitionWith([]);

export default {
  ...componentMeta("checkboxes-modal"),
  title: "Untitled UI/Application/Checkboxes Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

export const States = {
  ...liveCommandStory(definitionWith(["twitter", "medium", "facebook"])),
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
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Blog post published" });
    await expect(dialog).toBeVisible();
    const close = await canvas.findByRole("button", { name: "Close dialog" });
    await expect(close).toHaveFocus();
    const shareOnX = await canvas.findByRole("checkbox", { name: "Share on X" });
    await expect(shareOnX).not.toBeChecked();
    await userEvent.click(shareOnX);
    await expect(shareOnX).toBeChecked();
    await userEvent.click(await canvas.findByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
