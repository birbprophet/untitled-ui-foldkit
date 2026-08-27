/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { horizontalModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({ isHideAgain: S.Boolean, isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("HorizontalModalShown");
const Closed = m("HorizontalModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" | "Toggle" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowHorizontalModal = Command.define("ShowHorizontalModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseHorizontalModal = Command.define("CloseHorizontalModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const message = (tag: "Cancel" | "Confirm" | "Dismiss" | "Toggle"): Message => ({ _tag: tag });

const definitionWith = (isHideAgain: boolean) => ({
  Args,
  Model,
  init: () =>
    [
      { isHideAgain, isOpen: true } satisfies Model,
      [ShowHorizontalModal({ selector: "#horizontal-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Toggle") {
      return [{ ...model, isHideAgain: !model.isHideAgain }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "HorizontalModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [CloseHorizontalModal({ selector: "#horizontal-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof horizontalModal<Message>>[1]) =>
    horizontalModal(
      {
        hideAgain: model.isHideAgain,
        id: "horizontal-modal-story",
        isOpen: model.isOpen,
        onCancel: message("Cancel"),
        onConfirm: message("Confirm"),
        onDismiss: message("Dismiss"),
        onToggleHideAgain: message("Toggle"),
      },
      h,
    ),
});

const definition = definitionWith(false);
const meta = componentMeta("horizontal-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Horizontal Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = { ...liveCommandStory(definitionWith(true)), args: {} };
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
    const checkbox = within(dialog).getByRole("checkbox", { name: "Don't show again" });
    await userEvent.click(checkbox);
    await waitFor(async () => {
      await expect(canvas.getByRole("checkbox", { name: "Don't show again" })).toBeChecked();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#horizontal-modal-story")).toBeNull(),
    );
  },
};
