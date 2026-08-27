/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { imageCropModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

/* Photographic specimens stay inline per the story identity doctrine: URL data only, no network fetches. */
const optionImage = (index: number): string => {
  const hue = String(index * 34);
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'>" +
    `<rect width='320' height='200' fill='hsl(${hue} 26% 90%)'/>` +
    `<circle cx='252' cy='54' r='26' fill='hsl(${hue} 20% 80%)'/>` +
    `<path d='M0 170l76-66 58 48 60-52 126 90Z' fill='hsl(${hue} 22% 76%)'/>` +
    "</svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
const images = Array.from({ length: 10 }, (_, index) => ({
  alt: `Option ${String(index + 1)}`,
  src: optionImage(index),
}));
const Args = S.Struct({});
const Model = S.Struct({
  cropTopPercent: S.Number,
  dragOrigin: S.Number,
  isDragging: S.Boolean,
  isOpen: S.Boolean,
  selectedSrc: S.String,
});
type Model = typeof Model.Type;
const Shown = m("ImageCropModalShown");
const Closed = m("ImageCropModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "CropEnd" | "Dismiss" | "Save" | "Upload" }>
  | Readonly<{ _tag: "CropKeyboardMove"; deltaPercent: number }>
  | Readonly<{ _tag: "CropMove" | "CropStart"; screenY: number }>
  | Readonly<{ _tag: "Select"; src: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowImageCropModal = Command.define("ShowImageCropModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseImageCropModal = Command.define("CloseImageCropModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "CropEnd" | "Dismiss" | "Save" | "Upload"): Message => ({
  _tag: tag,
});
const cropAction = (tag: "CropMove" | "CropStart", screenY: number): Message => ({
  _tag: tag,
  screenY,
});
const cropKeyboardAction = (deltaPercent: number): Message => ({
  _tag: "CropKeyboardMove",
  deltaPercent,
});
const selectAction = (src: string): Message => ({ _tag: "Select", src });

const initialModel = {
  cropTopPercent: 24.484375,
  dragOrigin: 0,
  isDragging: false,
  isOpen: true,
  selectedSrc: images[0]?.src ?? "",
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () =>
    [initialModel, [ShowImageCropModal({ selector: "#image-crop-modal-story" })]] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Select") {
      return [{ ...model, selectedSrc: next.src }, []] as const;
    }
    if (next._tag === "CropStart") {
      return [{ ...model, dragOrigin: next.screenY, isDragging: true }, []] as const;
    }
    if (next._tag === "CropMove" && model.isDragging) {
      const delta = ((next.screenY - model.dragOrigin) / 312) * 100;
      return [
        {
          ...model,
          cropTopPercent: Math.min(50, Math.max(0, model.cropTopPercent + delta)),
          dragOrigin: next.screenY,
        },
        [],
      ] as const;
    }
    if (next._tag === "CropEnd") {
      return [{ ...model, isDragging: false }, []] as const;
    }
    if (next._tag === "CropKeyboardMove") {
      return [
        {
          ...model,
          cropTopPercent: Math.min(
            48.9791666667,
            Math.max(0, model.cropTopPercent + next.deltaPercent),
          ),
        },
        [],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "ImageCropModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Save"
      ? ([updated, [CloseImageCropModal({ selector: "#image-crop-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof imageCropModal<Message>>[1]) =>
    imageCropModal(
      {
        cropHeightPercent: 51.0208333333,
        cropTopPercent: model.cropTopPercent,
        id: "image-crop-modal-story",
        images,
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onCropKeyboardMove: cropKeyboardAction,
        onCropPointerDown: (screenY) => cropAction("CropStart", screenY),
        onCropPointerMove: (screenY) => cropAction("CropMove", screenY),
        onCropPointerUp: action("CropEnd"),
        onDismiss: action("Dismiss"),
        onImageSelected: selectAction,
        onSave: action("Save"),
        onUpload: () => action("Upload"),
        selectedSrc: model.selectedSrc,
      },
      h,
    ),
};

const meta = componentMeta("image-crop-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Image Crop Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Crop header image" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Select image Option 2" }));
    await waitFor(() =>
      expect(within(dialog).getAllByRole("img", { name: "Option 2" }).at(0)).toBeVisible(),
    );
    const cropArea = within(dialog).getByRole("slider", { name: "Crop area" });
    await expect(cropArea).toBeVisible();
    cropArea.focus();
    await expect(cropArea).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(dialog).getByRole("slider", { name: "Crop area" })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#image-crop-modal-story")).toBeNull(),
    );
  },
};
