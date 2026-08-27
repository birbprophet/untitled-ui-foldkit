/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook exposes only upstream props; live selection state stays in the FoldKit model. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import { fileUpload, fileUploadDropZone, fileUploadItem } from "ui/application";
import type {
  FileUploadDropZoneProps,
  FileUploadItemProps,
  FileUploadResult,
} from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Status = S.Union([S.Literal("uploading"), S.Literal("complete"), S.Literal("failed")]);
const Variant = S.Union([S.Literal("progress-bar"), S.Literal("progress-fill")]);
const Args = S.Struct({
  accept: S.String,
  allowsMultiple: S.Boolean,
  fileName: S.String,
  fileSize: S.Number,
  hint: S.String,
  isDisabled: S.Boolean,
  isDraggingOver: S.Boolean,
  isInvalid: S.Boolean,
  maxSize: S.Number,
  progress: S.Number,
  status: Status,
  variant: Variant,
});
const Model = S.Struct({
  ...Args.fields,
  selectedName: S.String,
  selectedSize: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Delete" }>
  | Readonly<{ _tag: "DragChanged"; isDraggingOver: boolean }>
  | Readonly<{ _tag: "FilesSelected"; selection: FileUploadResult }>
  | Readonly<{ _tag: "Retry" }>;

const filesSelected = (selection: FileUploadResult): Message => ({
  _tag: "FilesSelected",
  selection,
});
const dragChanged = (isDraggingOver: boolean): Message => ({
  _tag: "DragChanged",
  isDraggingOver,
});
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selectedName: "", selectedSize: 0 }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "DragChanged") {
      return { ...model, isDraggingOver: message.isDraggingOver };
    }
    if (message._tag === "Delete") {
      return { ...model, selectedName: "", selectedSize: 0 };
    }
    if (message._tag === "Retry") {
      return { ...model, progress: 20, status: "uploading" };
    }
    const selected = message.selection.accepted.at(0);
    return selected === undefined
      ? { ...model, isDraggingOver: false, isInvalid: true }
      : {
          ...model,
          isDraggingOver: false,
          isInvalid: false,
          selectedName: selected.name,
          selectedSize: selected.size,
          status: "uploading",
        };
  },
  view: (model: Model, h: Parameters<typeof fileUpload<Message>>[1]) =>
    fileUpload(
      {
        accept: model.accept,
        allowsMultiple: model.allowsMultiple,
        hint: model.hint,
        id: "file-upload-live",
        isDisabled: model.isDisabled,
        isDraggingOver: model.isDraggingOver,
        isInvalid: model.isInvalid,
        items:
          model.selectedName === ""
            ? []
            : [
                {
                  name: model.selectedName,
                  onDelete: { _tag: "Delete" },
                  onRetry: { _tag: "Retry" },
                  progress: model.progress,
                  size: model.selectedSize,
                  status: model.status,
                  variant: model.variant,
                },
              ],
        maxSize: model.maxSize,
        messageForDragState: dragChanged,
        messageForFiles: filesSelected,
      },
      h,
    ),
} as const;

const defaultArgs = {
  accept: ".svg,.png,.jpg,.jpeg,.gif",
  allowsMultiple: true,
  fileName: "Tech design requirements.pdf",
  fileSize: 200_000,
  hint: "SVG, PNG, JPG or GIF (max. 800x400px)",
  isDisabled: false,
  isDraggingOver: false,
  isInvalid: false,
  maxSize: 5_000_000,
  progress: 40,
  status: "uploading",
  variant: "progress-bar",
} as const;

const specimen = (children: readonly Html[], h: HtmlBuilder<Message>) =>
  h.div([h.Class("uui-file-upload-specimen flex flex-col gap-4")], children);

const dropZoneProps = (
  model: Model,
  extra: Partial<FileUploadDropZoneProps<Message>> = {},
): FileUploadDropZoneProps<Message> => ({
  accept: model.accept,
  allowsMultiple: model.allowsMultiple,
  hint: model.hint,
  id: `file-upload-${extra.isDisabled === true ? "disabled" : extra.isInvalid === true ? "invalid" : "default"}`,
  isDisabled: model.isDisabled,
  isDraggingOver: model.isDraggingOver,
  isInvalid: model.isInvalid,
  maxSize: model.maxSize,
  ...extra,
});

const itemProps = (
  model: Model,
  extra: Partial<FileUploadItemProps<Message>> = {},
): FileUploadItemProps<Message> => ({
  name: model.fileName,
  progress: model.progress,
  size: model.fileSize,
  status: model.status,
  variant: model.variant,
  ...extra,
});

export default {
  ...componentMeta("file-upload-base"),
  title: "Untitled UI/Application/File Upload Base",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["Drop zone", [specimen([fileUploadDropZone(dropZoneProps(model), h)], h)]],
          [
            "Progress bar",
            [specimen([fileUploadItem(itemProps(model, { variant: "progress-bar" }), h)], h)],
          ],
          [
            "Progress fill",
            [specimen([fileUploadItem(itemProps(model, { variant: "progress-fill" }), h)], h)],
          ],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Drag over",
            [specimen([fileUploadDropZone(dropZoneProps(model, { isDraggingOver: true }), h)], h)],
          ],
          [
            "Disabled",
            [specimen([fileUploadDropZone(dropZoneProps(model, { isDisabled: true }), h)], h)],
          ],
          [
            "Invalid",
            [specimen([fileUploadDropZone(dropZoneProps(model, { isInvalid: true }), h)], h)],
          ],
          [
            "Complete",
            [
              specimen(
                [fileUploadItem(itemProps(model, { progress: 100, status: "complete" }), h)],
                h,
              ),
            ],
          ],
          ["Failed", [specimen([fileUploadItem(itemProps(model, { status: "failed" }), h)], h)]],
        ],
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
        [
          specimen(
            [
              fileUploadDropZone(dropZoneProps(model), h),
              fileUploadItem(itemProps(model, { variant: "progress-fill" }), h),
            ],
            h,
          ),
        ],
      ),
  }),
  args: defaultArgs,
};

export const Responsive = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) => specimen([fileUploadDropZone(dropZoneProps(model), h)], h),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const storyRoot = canvasElement.ownerDocument.body;
    const canvas = within(storyRoot);
    const input = await canvas.findByRole("button", { name: "Click to upload" });
    await userEvent.upload(input, new File(["report"], "report.png", { type: "image/png" }));
    await expect(await canvas.findByText("report.png")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Delete" }));
    await expect(canvas.queryByText("report.png")).toBeNull();
  },
};
