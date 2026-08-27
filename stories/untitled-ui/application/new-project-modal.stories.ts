/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/no-length-comparison -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { agentFace } from "../../fixtures/brand.ts";
import { newProjectModal } from "../../../src/application.ts";
import type { FileUploadResult } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Upload = S.Struct({ name: S.String, previewUrl: S.String, progress: S.Number });
const Model = S.Struct({
  isDraggingOver: S.Boolean,
  isOpen: S.Boolean,
  isTeamOpen: S.Boolean,
  name: S.String,
  selectedTeamId: S.String,
  tagInput: S.String,
  upload: S.optional(Upload),
});

const teamLogos = {
  ephemeral: agentFace("Ephemeral"),
  leapyear: agentFace("Leapyear"),
  watchtower: agentFace("Watchtower"),
} as const;

type Model = typeof Model.Type;
const Shown = m("NewProjectModalShown");
const Closed = m("NewProjectModalClosed");
type Message =
  | Readonly<{ _tag: "Create" | "Dismiss" | "SaveDraft" | "Schedule" }>
  | Readonly<{ _tag: "DragState"; isDraggingOver: boolean }>
  | Readonly<{ _tag: "FilesSelected"; name: string; previewUrl: string }>
  | Readonly<{ _tag: "NameInput" | "TagInput"; value: string }>
  | Readonly<{ _tag: "TagSelect" | "TeamFocus" | "TeamSelect"; value: string }>
  | Readonly<{ _tag: "TeamOpen"; isOpen: boolean }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowNewProjectModal = Command.define("ShowNewProjectModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseNewProjectModal = Command.define("CloseNewProjectModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Create" | "Dismiss" | "SaveDraft" | "Schedule"): Message => ({
  _tag: tag,
});
const filesSelected = (selection: FileUploadResult): Message => {
  const [first] = selection.accepted;
  return first === undefined
    ? { _tag: "DragState", isDraggingOver: false }
    : { _tag: "FilesSelected", name: first.name, previewUrl: URL.createObjectURL(first) };
};
const dragState = (isDraggingOver: boolean): Message => ({ _tag: "DragState", isDraggingOver });
const valueMessage = (
  tag: "NameInput" | "TagInput" | "TagSelect" | "TeamFocus" | "TeamSelect",
  nextValue: string,
): Message => ({ _tag: tag, value: nextValue });
const teamOpen = (isOpen: boolean): Message => ({ _tag: "TeamOpen", isOpen });

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        isDraggingOver: false,
        isOpen: true,
        isTeamOpen: false,
        name: "About us",
        selectedTeamId: "watchtower",
        tagInput: "",
        upload: undefined,
      } satisfies Model,
      [ShowNewProjectModal({ selector: "#new-project-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "NameInput") {
      return [{ ...model, name: next.value }, []] as const;
    }
    if (next._tag === "TagInput") {
      return [{ ...model, tagInput: next.value }, []] as const;
    }
    if (next._tag === "TagSelect") {
      const nextTags = model.tagInput === "" ? next.value : `${model.tagInput}, ${next.value}`;
      return [{ ...model, tagInput: nextTags }, []] as const;
    }
    if (next._tag === "TeamSelect") {
      return [{ ...model, selectedTeamId: next.value }, []] as const;
    }
    if (next._tag === "TeamOpen") {
      return [{ ...model, isTeamOpen: next.isOpen }, []] as const;
    }
    if (next._tag === "DragState") {
      return [{ ...model, isDraggingOver: next.isDraggingOver }, []] as const;
    }
    if (next._tag === "FilesSelected") {
      return [
        {
          ...model,
          isDraggingOver: false,
          upload: { name: next.name, previewUrl: next.previewUrl, progress: 40 },
        },
        [],
      ] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "NewProjectModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Create" || next._tag === "Dismiss" || next._tag === "Schedule"
      ? ([updated, [CloseNewProjectModal({ selector: "#new-project-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof newProjectModal<Message>>[1]) =>
    newProjectModal(
      {
        id: "new-project-modal-story",
        isDraggingOver: model.isDraggingOver,
        isOpen: model.isOpen,
        name: model.name,
        onCreate: action("Create"),
        onDismiss: action("Dismiss"),
        onDragState: dragState,
        onFilesSelected: filesSelected,
        onNameInput: (value) => valueMessage("NameInput", value),
        onSaveDraft: action("SaveDraft"),
        onSchedule: action("Schedule"),
        onTagInput: (value) => valueMessage("TagInput", value),
        onTagSelect: (value) => valueMessage("TagSelect", value),
        onTeamFocus: (value) => valueMessage("TeamFocus", value),
        onTeamOpenChanged: teamOpen,
        onTeamSelect: (value) => valueMessage("TeamSelect", value),
        selectedTeamId: model.selectedTeamId,
        tagInput: model.tagInput,
        teamLogos,
        upload: model.upload,
      },
      h,
    ),
};

const meta = componentMeta("new-project-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/New Project Modal",
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
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Create a new project" });
    const name = within(dialog).getByRole("textbox", { name: "Project name" });
    await userEvent.clear(name);
    await userEvent.type(name, "Website refresh");
    dialog = await page.findByRole("dialog", { name: "Create a new project" });
    await expect(within(dialog).getByDisplayValue("Website refresh")).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Figma" }));
    dialog = await page.findByRole("dialog", { name: "Create a new project" });
    await expect(within(dialog).getByDisplayValue("Figma")).toBeVisible();
    const input = within(dialog).getByLabelText(/Click to upload/u, { selector: "input" });
    await userEvent.upload(input, new File(["image"], "project.png", { type: "image/png" }));
    dialog = await page.findByRole("dialog", { name: "Create a new project" });
    await expect(within(dialog).getByAltText("project.png")).toBeVisible();
    dialog = await page.findByRole("dialog", { name: "Create a new project" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Create project" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#new-project-modal-story")).toBeNull(),
    );
  },
};
