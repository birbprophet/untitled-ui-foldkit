/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog/file events use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { fileUploadMenu } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const FileModel = S.Struct({
  id: S.String,
  name: S.String,
  progress: S.Number,
  size: S.Number,
  status: S.Literals(["complete", "failed", "uploading"]),
  type: S.String,
});
const Model = S.Struct({
  files: S.Array(FileModel),
  isDraggingOver: S.Boolean,
  isInvalid: S.Boolean,
  isOpen: S.Boolean,
  locale: S.Literals(["en-US", "pt-BR"]),
});
type Model = typeof Model.Type;
const Shown = m("FileUploadMenuShown");
const Closed = m("FileUploadMenuClosed");
type Message =
  | Readonly<{ _tag: "Attach" | "Cancel" | "Dismiss" }>
  | Readonly<{ _tag: "Delete" | "Retry"; fileId: string }>
  | Readonly<{ _tag: "DragState"; isDraggingOver: boolean }>
  | Readonly<{
      _tag: "FilesSelected";
      files: readonly Readonly<{ id: string; name: string; size: number; type: string }>[];
    }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowFileUploadMenu = Command.define("ShowFileUploadMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-file-upload-menu-close]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseFileUploadMenu = Command.define("CloseFileUploadMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Attach" | "Cancel" | "Dismiss"): Message => ({ _tag: tag });
const deleteFile = (fileId: string): Message => ({ _tag: "Delete", fileId });
const dragState = (isDraggingOver: boolean): Message => ({
  _tag: "DragState",
  isDraggingOver,
});
const retryFile = (fileId: string): Message => ({ _tag: "Retry", fileId });
const selectedFiles = (files: readonly File[]): Message => ({
  _tag: "FilesSelected",
  files: files.map((file) => ({
    id: `uploaded-${file.name}`,
    name: file.name,
    size: file.size,
    type: file.name.split(".").at(-1)?.toLowerCase() ?? file.type,
  })),
});

interface StoryFile {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly size: number;
  readonly status: "complete" | "failed" | "uploading";
  readonly type: string;
}

const sourceFiles: readonly StoryFile[] = [
  {
    id: "tech-design",
    name: "Tech design requirements.pdf",
    progress: 100,
    size: 204_800,
    status: "complete",
    type: "pdf",
  },
  {
    id: "dashboard-recording",
    name: "Dashboard recording.mp4",
    progress: 40,
    size: 16_777_216,
    status: "uploading",
    type: "mp4",
  },
  {
    id: "dashboard-prototype",
    name: "Dashboard prototype FINAL.fig",
    progress: 80,
    size: 4_404_019,
    status: "uploading",
    type: "fig",
  },
];

const makeDefinition = (state: "interaction" | "source" | "states") => ({
  Args,
  Model,
  init: (args: typeof Args.Type) => {
    const files = sourceFiles.map((file): StoryFile =>
      state !== "source" && file.id === "dashboard-prototype"
        ? { ...file, progress: 32, status: "failed" }
        : file,
    );
    return [
      {
        files,
        isDraggingOver: false,
        isInvalid: state === "states",
        isOpen: true,
        locale: args.locale,
      } satisfies Model,
      [ShowFileUploadMenu({ selector: "#file-upload-menu-story" })],
    ] as const;
  },
  update: (model: Model, next: Message) => {
    if (next._tag === "FilesSelected") {
      return [
        {
          ...model,
          files: [
            ...next.files.map((file): StoryFile => ({ ...file, progress: 0, status: "uploading" })),
            ...model.files,
          ],
          isDraggingOver: false,
          isInvalid: false,
        },
        [],
      ] as const;
    }
    if (next._tag === "Delete") {
      return [
        { ...model, files: model.files.filter((file) => file.id !== next.fileId) },
        [],
      ] as const;
    }
    if (next._tag === "Retry") {
      return [
        {
          ...model,
          files: model.files.map((file): StoryFile =>
            file.id === next.fileId ? { ...file, progress: 0, status: "uploading" } : file,
          ),
        },
        [],
      ] as const;
    }
    if (next._tag === "DragState") {
      return [{ ...model, isDraggingOver: next.isDraggingOver }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "FileUploadMenuClosed" ? false : model.isOpen,
    };
    return next._tag === "Attach" || next._tag === "Cancel" || next._tag === "Dismiss"
      ? ([updated, [CloseFileUploadMenu({ selector: "#file-upload-menu-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof fileUploadMenu<Message>>[1]) =>
    fileUploadMenu(
      {
        files: model.files.map((file) => ({
          ...file,
          onDelete: deleteFile(file.id),
          onRetry: retryFile(file.id),
          status: file.status,
        })),
        id: "file-upload-menu-story",
        isDraggingOver: model.isDraggingOver,
        isInvalid: model.isInvalid,
        isOpen: model.isOpen,
        locale: model.locale,
        onAttach: action("Attach"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onDragState: dragState,
        onFilesSelected: selectedFiles,
      },
      h,
    ),
});

const definition = makeDefinition("source");
const interactionDefinition = makeDefinition("interaction");
const meta = componentMeta("file-upload-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/File Upload Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const States = {
  ...liveCommandStory(makeDefinition("states")),
  args: { locale: "en-US" },
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
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(interactionDefinition),
  args: { locale: "pt-BR" },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Menu lateral" });
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
    await expect(within(dialog).getByText("Tech design requirements.pdf")).toBeVisible();
    await expect(within(dialog).getByText("40%")).toBeVisible();
    const input = within(dialog).getByLabelText(/Clique para carregar/u, { selector: "input" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.upload(input, new File(["report"], "report.png", { type: "image/png" }));
    await waitFor(async () => {
      dialog = await page.findByRole("dialog", { name: "Menu lateral" });
      await expect(within(dialog).getByText("report.png")).toBeVisible();
    });
    const [uploadedDelete] = within(dialog).getAllByRole("button", { name: "Excluir" });
    await expect(uploadedDelete).toBeDefined();
    if (uploadedDelete !== undefined) {
      await userEvent.click(uploadedDelete);
    }
    await waitFor(async () => {
      dialog = await page.findByRole("dialog", { name: "Menu lateral" });
      await expect(within(dialog).queryByText("report.png")).toBeNull();
    });
    await userEvent.click(within(dialog).getByRole("button", { name: "Tentar novamente" }));
    await waitFor(async () => {
      dialog = await page.findByRole("dialog", { name: "Menu lateral" });
      await expect(within(dialog).queryByText(/Falha no carregamento/u)).toBeNull();
      await expect(within(dialog).getByText("0%")).toBeVisible();
    });
    const dropzone = dialog.querySelector<HTMLElement>("[data-dropzone]");
    await expect(dropzone).not.toBeNull();
    dropzone?.dispatchEvent(new DragEvent("dragenter", { bubbles: true, cancelable: true }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("[data-dropzone]")?.className).toContain(
        "ring-2",
      ),
    );
  },
};
