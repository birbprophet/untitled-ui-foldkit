/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { togglesModal } from "../../../src/application.ts";
import type { TogglesModalChannel } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Channel = S.Literals(["facebook", "medium", "twitter"]);
const Model = S.Struct({ isOpen: S.Boolean, selectedChannels: S.Array(Channel) });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("TogglesDialogShown");
const DialogClosed = m("TogglesDialogClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "Toggle"; channel: TogglesModalChannel }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type;

const ShowTogglesDialog = Command.define("ShowTogglesDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseTogglesDialog = Command.define("CloseTogglesDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const simple = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });

const definitionWith = (selectedChannels: readonly TogglesModalChannel[]) => ({
  Args,
  Model,
  init: (_args: Args) =>
    [
      { isOpen: true, selectedChannels: [...selectedChannels] } satisfies Model,
      [ShowTogglesDialog({ selector: "#toggles-modal-story" })],
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
      isOpen: message._tag === "TogglesDialogClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss"
      ? ([next, [CloseTogglesDialog({ selector: "#toggles-modal-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof togglesModal<Message>>[1]) =>
    togglesModal(
      {
        id: "toggles-modal-story",
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
const definition = definitionWith(["twitter", "medium"]);
const meta = componentMeta("toggles-modal");

export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Toggles Modal",
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
    await expect(await canvas.findByRole("button", { name: "Close dialog" })).toHaveFocus();

    const shareOnX = await canvas.findByRole("switch", { name: "Share on X" });
    const shareOnMedium = await canvas.findByRole("switch", { name: "Share on Medium" });
    const shareOnFacebook = await canvas.findByRole("switch", { name: "Share on Facebook" });
    await expect(shareOnX).toBeChecked();
    await expect(shareOnMedium).toBeChecked();
    await expect(shareOnFacebook).not.toBeChecked();

    await userEvent.click(shareOnX);
    await expect(shareOnX).not.toBeChecked();
    await userEvent.click(shareOnFacebook);
    await expect(shareOnFacebook).toBeChecked();

    await userEvent.click(await canvas.findByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
