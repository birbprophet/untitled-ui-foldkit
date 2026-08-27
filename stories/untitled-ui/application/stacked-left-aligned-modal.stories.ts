/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { stackedLeftAlignedModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("StackedLeftAlignedModalShown");
const Closed = m("StackedLeftAlignedModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowStackedLeftAlignedModal = Command.define("ShowStackedLeftAlignedModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseStackedLeftAlignedModal = Command.define("CloseStackedLeftAlignedModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const message = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });

const definition = {
  Args,
  Model,
  init: () =>
    [
      { isOpen: true } satisfies Model,
      [ShowStackedLeftAlignedModal({ selector: "#stacked-left-aligned-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    const updated = {
      ...model,
      isOpen: next._tag === "StackedLeftAlignedModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([
          updated,
          [CloseStackedLeftAlignedModal({ selector: "#stacked-left-aligned-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof stackedLeftAlignedModal<Message>>[1]) =>
    stackedLeftAlignedModal(
      {
        id: "stacked-left-aligned-modal-story",
        isOpen: model.isOpen,
        onCancel: message("Cancel"),
        onConfirm: message("Confirm"),
        onDismiss: message("Dismiss"),
      },
      h,
    ),
};

const meta = componentMeta("stacked-left-aligned-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Stacked Left Aligned Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Blog post published" });
    await expect(within(dialog).getByText(/republish changes/u)).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector("#stacked-left-aligned-modal-story"),
      ).toBeNull(),
    );
  },
};
