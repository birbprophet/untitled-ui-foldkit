/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook exercises the controlled FoldKit model through exact Image Picker props. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import { defaultImageAdjustments, imagePicker } from "ui/application";
import type { ImageAdjustments, ImageFillMode, ImagePickerProps } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const FillMode = S.Union([
  S.Literal("fill"),
  S.Literal("fit"),
  S.Literal("crop"),
  S.Literal("tile"),
]);
const Adjustments = S.Struct({
  contrast: S.Number,
  exposure: S.Number,
  highlights: S.Number,
  saturation: S.Number,
  shadows: S.Number,
  temperature: S.Number,
  tint: S.Number,
});
const Args = S.Struct({
  adjustments: Adjustments,
  fillMode: FillMode,
  imageUrl: S.String,
  isDraggingOver: S.Boolean,
  rotation: S.Number,
});
const Model = Args;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "AdjustmentChanged"; key: keyof ImageAdjustments; value: number }>
  | Readonly<{ _tag: "DragChanged"; isDraggingOver: boolean }>
  | Readonly<{ _tag: "FillModeChanged"; fillMode: ImageFillMode }>
  | Readonly<{ _tag: "FilesSelected"; files: readonly File[] }>
  | Readonly<{ _tag: "Rotated" }>;

const adjustmentChanged = (key: keyof ImageAdjustments, value: number): Message => ({
  _tag: "AdjustmentChanged",
  key,
  value,
});
const dragChanged = (isDraggingOver: boolean): Message => ({ _tag: "DragChanged", isDraggingOver });
const fillModeChanged = (fillMode: ImageFillMode): Message => ({
  _tag: "FillModeChanged",
  fillMode,
});
const filesSelected = (files: readonly File[]): Message => ({ _tag: "FilesSelected", files });
const rotated: Message = { _tag: "Rotated" };

const update = (model: Model, message: Message): Model => {
  if (message._tag === "AdjustmentChanged") {
    return { ...model, adjustments: { ...model.adjustments, [message.key]: message.value } };
  }
  if (message._tag === "DragChanged") {
    return { ...model, isDraggingOver: message.isDraggingOver };
  }
  if (message._tag === "FillModeChanged") {
    return { ...model, fillMode: message.fillMode };
  }
  if (message._tag === "Rotated") {
    return { ...model, rotation: (model.rotation + 90) % 360 };
  }
  return { ...model, isDraggingOver: false };
};

const props = (
  model: Model,
  extra: Partial<ImagePickerProps<Message>> = {},
): ImagePickerProps<Message> => ({
  ...model,
  id: "image-picker-upload",
  imageUrl: model.imageUrl || undefined,
  messageForAdjustment: adjustmentChanged,
  messageForDragState: dragChanged,
  messageForFiles: filesSelected,
  messageForFillMode: fillModeChanged,
  onRotate: rotated,
  ...extra,
});

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update,
  view: (model: Model, h: Parameters<typeof imagePicker<Message>>[1]) =>
    imagePicker(props(model), h),
} as const;

const defaultArgs = {
  adjustments: defaultImageAdjustments,
  fillMode: "fill",
  imageUrl: "",
  isDraggingOver: false,
  rotation: 0,
} as const;

const adjusted: ImageAdjustments = {
  contrast: -24,
  exposure: 32,
  highlights: 60,
  saturation: 45,
  shadows: -40,
  temperature: 18,
  tint: -12,
};

const specimen = (child: Html, h: HtmlBuilder<Message>) =>
  h.div([h.Class("uui-image-picker-specimen w-80 shrink-0")], [child]);

export default {
  ...componentMeta("image-picker"),
  title: "Untitled UI/Application/Image Picker",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) => matrix([["Default", [specimen(imagePicker(props(model), h), h)]]], h),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [["Adjusted", [specimen(imagePicker(props(model, { adjustments: adjusted }), h), h)]]],
        h,
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8 outline-[100vmax] outline-bg-primary"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(imagePicker(props(model), h), h)],
      ),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const fillMode = await canvas.findByRole("combobox", { name: "Image fill mode" });
    await userEvent.selectOptions(fillMode, "fit");
    await expect(fillMode).toHaveValue("fit");
    const exposure = await canvas.findByRole("slider", { name: "Exposure" });
    await userEvent.click(exposure);
    exposure.setAttribute("value", "1");
    exposure.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await expect(exposure).toHaveValue("1");
    await userEvent.click(await canvas.findByRole("button", { name: "Rotate image" }));
    await expect(await canvas.findByLabelText("Click to upload")).toHaveAttribute("type", "file");
  },
};
