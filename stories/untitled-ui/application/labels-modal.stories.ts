/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { labelsModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const options = [
  { color: "sky", id: "in-progress", label: "In progress" },
  { color: "indigo", id: "design", label: "Design" },
  { color: "pink", id: "web", label: "Web" },
] as const;
const Args = S.Struct({});
const Model = S.Struct({
  focusedId: S.optional(S.String),
  inputValue: S.String,
  isOpen: S.Boolean,
  isPickerOpen: S.Boolean,
  selectedIds: S.Array(S.String),
});
type Model = typeof Model.Type;
const Shown = m("LabelsModalShown");
const Closed = m("LabelsModalClosed");
type Message =
  | Readonly<{ _tag: "Add" | "Cancel" | "ClosePicker" | "Dismiss" | "OpenPicker" }>
  | Readonly<{ _tag: "Focus" | "Remove" | "Select"; id: string }>
  | Readonly<{ _tag: "Input"; labelFilter: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowLabelsModal = Command.define("ShowLabelsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseLabelsModal = Command.define("CloseLabelsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Add" | "Cancel" | "ClosePicker" | "Dismiss" | "OpenPicker"): Message => ({
  _tag: tag,
});
const idAction = (tag: "Focus" | "Remove" | "Select", id: string): Message => ({ _tag: tag, id });
const inputAction = (labelFilter: string): Message => ({ _tag: "Input", labelFilter });
const initialModel = {
  focusedId: undefined,
  inputValue: "",
  isOpen: true,
  isPickerOpen: false,
  selectedIds: options.map((option) => option.id),
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () => [initialModel, [ShowLabelsModal({ selector: "#labels-modal-story" })]] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Input") {
      return [{ ...model, inputValue: next.labelFilter, isPickerOpen: true }, []] as const;
    }
    if (next._tag === "Focus") {
      return [{ ...model, focusedId: next.id }, []] as const;
    }
    if (next._tag === "Remove") {
      return [
        { ...model, selectedIds: model.selectedIds.filter((id) => id !== next.id) },
        [],
      ] as const;
    }
    if (next._tag === "Select") {
      return [
        {
          ...model,
          inputValue: "",
          isPickerOpen: false,
          selectedIds: model.selectedIds.includes(next.id)
            ? model.selectedIds
            : [...model.selectedIds, next.id],
        },
        [],
      ] as const;
    }
    if (next._tag === "OpenPicker") {
      return [{ ...model, isPickerOpen: true }, []] as const;
    }
    if (next._tag === "ClosePicker") {
      return [{ ...model, isPickerOpen: false }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "LabelsModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Add" || next._tag === "Cancel" || next._tag === "Dismiss"
      ? ([updated, [CloseLabelsModal({ selector: "#labels-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof labelsModal<Message>>[1]) =>
    labelsModal(
      {
        focusedId: model.focusedId,
        id: "labels-modal-story",
        inputValue: model.inputValue,
        isOpen: model.isOpen,
        isPickerOpen: model.isPickerOpen,
        onAdd: action("Add"),
        onCancel: action("Cancel"),
        onClosePicker: action("ClosePicker"),
        onDismiss: action("Dismiss"),
        onFocusOption: (id) => idAction("Focus", id),
        onInput: inputAction,
        onOpenPicker: action("OpenPicker"),
        onRemove: (id) => idAction("Remove", id),
        onSelect: (id) => idAction("Select", id),
        options,
        selectedIds: model.selectedIds,
      },
      h,
    ),
};

const meta = componentMeta("labels-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Labels Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Add labels to project" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Remove Web" }));
    await expect(within(dialog).queryByRole("button", { name: "Remove Web" })).toBeNull();
    const labels = within(dialog).getByRole("combobox", { name: "Labels" });
    await userEvent.click(labels);
    await userEvent.type(labels, "Web");
    await userEvent.click(within(dialog).getByRole("option", { name: "Web" }));
    await expect(within(dialog).getByRole("button", { name: "Remove Web" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#labels-modal-story")).toBeNull(),
    );
  },
};
