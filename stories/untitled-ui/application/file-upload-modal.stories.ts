/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-low-signal-variable-names, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { fileUploadModal } from "ui/application";
import type { FileUploadResult } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const FileModel = S.Struct({ name: S.String, progress: S.Number, size: S.Number, type: S.String });
const Model = S.Struct({ files: S.Array(FileModel), isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("FileUploadModalShown");
const Closed = m("FileUploadModalClosed");
type Message =
  | Readonly<{ _tag: "Attach" | "Cancel" | "Dismiss" }>
  | Readonly<{ _tag: "Delete"; name: string }>
  | Readonly<{
      _tag: "FilesSelected";
      files: readonly Readonly<{ name: string; size: number; type: string }>[];
    }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowFileUploadModal = Command.define("ShowFileUploadModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseFileUploadModal = Command.define("CloseFileUploadModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Attach" | "Cancel" | "Dismiss"): Message => ({ _tag: tag });
const deleteFile = (name: string): Message => ({ _tag: "Delete", name });
const filesSelected = (result: FileUploadResult): Message => ({
  _tag: "FilesSelected",
  files: result.accepted.map((file) => ({ name: file.name, size: file.size, type: file.type })),
});

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        files: [
          {
            name: "Tech design requirements.pdf",
            progress: 100,
            size: 210_000,
            type: "pdf",
          },
        ],
        isOpen: true,
      } satisfies Model,
      [ShowFileUploadModal({ selector: "#file-upload-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FilesSelected") {
      return [
        {
          ...model,
          files: next.files.map((file) => ({ ...file, progress: 100 })).concat(model.files),
        },
        [],
      ] as const;
    }
    if (next._tag === "Delete") {
      return [
        { ...model, files: model.files.filter((file) => file.name !== next.name) },
        [],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "FileUploadModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Attach" || next._tag === "Cancel" || next._tag === "Dismiss"
      ? ([updated, [CloseFileUploadModal({ selector: "#file-upload-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof fileUploadModal<Message>>[1]) =>
    fileUploadModal(
      {
        files: model.files.map((file) => ({
          ...file,
          onDelete: deleteFile(file.name),
        })),
        id: "file-upload-modal-story",
        isOpen: model.isOpen,
        onAttach: action("Attach"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onFilesSelected: filesSelected,
      },
      h,
    ),
};

const meta = componentMeta("file-upload-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/File Upload Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Upload and attach files" });
    const input = within(dialog).getByLabelText(/Click to upload/u, { selector: "input" });
    await userEvent.upload(input, new File(["report"], "report.png", { type: "image/png" }));
    await expect(await within(dialog).findByText("report.png")).toBeVisible();
    await userEvent.click(within(dialog).getAllByRole("button", { name: "Delete" })[0]);
    await waitFor(() => expect(within(dialog).queryByText("report.png")).toBeNull());
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#file-upload-modal-story")).toBeNull(),
    );
  },
};
