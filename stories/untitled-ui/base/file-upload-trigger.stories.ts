/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { fileUploadTrigger } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, selections: S.Finite });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected" }>;
const selected: Message = { _tag: "Selected" };
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selections: 0 }),
  update: (model: Model): Model => ({ ...model, selections: model.selections + 1 }),
  view: (model: Model, h: Parameters<typeof fileUploadTrigger<Message>>[1]) =>
    fileUploadTrigger(
      {
        acceptedFileTypes: ["image/png"],
        id: "file-upload-interaction",
        onSelect: selected,
        triggerLabel: model.label,
      },
      h,
    ),
} as const;

export default {
  ...componentMeta("file-upload-trigger"),
  title: "Untitled UI/Base/File Upload Trigger",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Selection",
            [
              fileUploadTrigger(
                {
                  acceptedFileTypes: ["image/png", "image/jpeg"],
                  id: "file-upload-single",
                  triggerLabel: model.label,
                },
                h,
              ),
              fileUploadTrigger(
                {
                  allowsMultiple: true,
                  id: "file-upload-multiple",
                  triggerLabel: "Upload files",
                },
                h,
              ),
            ],
          ],
          [
            "Capture",
            [
              fileUploadTrigger(
                {
                  acceptedFileTypes: ["image/*"],
                  defaultCamera: "environment",
                  id: "file-upload-camera",
                  triggerLabel: "Take photo",
                },
                h,
              ),
              fileUploadTrigger(
                {
                  acceptDirectory: true,
                  id: "file-upload-directory",
                  triggerLabel: "Choose folder",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Upload file" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              fileUploadTrigger(
                {
                  id: "file-upload-enabled",
                  triggerLabel: model.label,
                },
                h,
              ),
              fileUploadTrigger(
                {
                  id: "file-upload-disabled",
                  isDisabled: true,
                  triggerLabel: model.label,
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Upload file" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [
          fileUploadTrigger(
            {
              id: "file-upload-dark",
              triggerLabel: model.label,
            },
            h,
          ),
        ],
      ),
  }),
  args: { label: "Upload file" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Upload file" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const input = await canvas.findByLabelText<HTMLInputElement>("Upload file");
    await userEvent.upload(input, new File(["pixels"], "avatar.png", { type: "image/png" }));
    await waitFor(() => expect(input.files).toHaveLength(1));
  },
};
