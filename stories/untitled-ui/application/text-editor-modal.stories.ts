/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook interactions and native editor commands are browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import type { Command as CommandValue } from "foldkit/command";
import * as FoldkitCommand from "foldkit/command";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { textEditorModal } from "../../../../../packages/ui/src/application/text-editor-modal.ts";
import type { TextEditorModalEditor } from "../../../../../packages/ui/src/application/text-editor-modal.ts";
import { runTextEditorCommand } from "ui/base";
import type { TextEditorChange, TextEditorCommandRequest, TextEditorSelection } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const excerptParagraphOne =
  "We need another and a wiser and perhaps a more mystical concept of animals. Remote from universal nature, and living by complicated artifice, man in civilization surveys the creature through the glass of his knowledge and sees thereby a feather magnified and the whole image in distortion.";
const excerptParagraphTwoStart =
  "We patronize them for their incompleteness, for their tragic fate of having taken form so far below ourselves.";
const excerptParagraphTwoEnd =
  "And therein we err, and greatly err. For the animal shall not be measured by man.";
const excerptParagraphThreeStart =
  "In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear.";
const excerptParagraphThreeEnd =
  "They are not brethren, they are not underlings; they are other nations, caught with ourselves in the net of life and time, fellow prisoners of the splendour and travail of the earth.";
const excerpt = `<p>${excerptParagraphOne}</p><p></p><p>${excerptParagraphTwoStart} ${excerptParagraphTwoEnd}</p><p></p><p>${excerptParagraphThreeStart} ${excerptParagraphThreeEnd}</p>`;
const visibleText = (html: string): string => html.replaceAll(/<[^>]+>/gu, " ").trim();

const Selection = S.Struct({
  align: S.Literals(["center", "left", "right"]),
  bold: S.Boolean,
  bulletList: S.Boolean,
  color: S.String,
  fontFamily: S.String,
  fontSize: S.String,
  italic: S.Boolean,
  link: S.Boolean,
  underline: S.Boolean,
});
const Args = S.Struct({});
const Model = S.Struct({
  contentHtml: S.String,
  contentText: S.String,
  isOpen: S.Boolean,
  selection: Selection,
});
type Model = typeof Model.Type;
const Shown = m("TextEditorModalShown");
const Closed = m("TextEditorModalClosed");
type Message =
  | Readonly<{ _tag: "AskAi" | "Cancel" | "Dismiss" | "Save" }>
  | Readonly<{ _tag: "EditorChanged"; change: TextEditorChange; editor: TextEditorModalEditor }>
  | Readonly<{
      _tag: "EditorCommand";
      editor: TextEditorModalEditor;
      request: TextEditorCommandRequest;
    }>
  | Readonly<{ _tag: "EditorCommandCompleted" }>
  | Readonly<{ _tag: "EditorGenerate" | "EditorImage"; editor: TextEditorModalEditor }>
  | Readonly<{
      _tag: "EditorSelection";
      editor: TextEditorModalEditor;
      selection: TextEditorSelection;
    }>
  | typeof Shown.Type
  | typeof Closed.Type;

const initialSelection: TextEditorSelection = {
  align: "left",
  bold: false,
  bulletList: false,
  color: "#181D27",
  fontFamily: "Inter",
  fontSize: "16px",
  italic: false,
  link: false,
  underline: false,
};

const ShowTextEditorModal = Command.define("ShowTextEditorModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseTextEditorModal = Command.define("CloseTextEditorModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "AskAi" | "Cancel" | "Dismiss" | "Save"): Message => ({ _tag: tag });
const editorChanged = (editor: TextEditorModalEditor, change: TextEditorChange): Message => ({
  _tag: "EditorChanged",
  change,
  editor,
});
const editorCommand = (
  editor: TextEditorModalEditor,
  request: TextEditorCommandRequest,
): Message => ({ _tag: "EditorCommand", editor, request });
const editorGenerate = (editor: TextEditorModalEditor): Message => ({
  _tag: "EditorGenerate",
  editor,
});
const editorImage = (editor: TextEditorModalEditor): Message => ({
  _tag: "EditorImage",
  editor,
});
const editorSelection = (
  editor: TextEditorModalEditor,
  selection: TextEditorSelection,
): Message => ({ _tag: "EditorSelection", editor, selection });
const commandCompleted: Message = { _tag: "EditorCommandCompleted" };
const updateResult = (
  model: Model,
  commands: readonly CommandValue<Message>[] = [],
): readonly [Model, readonly CommandValue<Message>[]] => [model, commands];

const makeDefinition = (state: "interaction" | "source") => ({
  Args,
  Model,
  init: () => {
    const html = state === "interaction" ? "<p>Featured excerpt</p>" : excerpt;
    return [
      {
        contentHtml: html,
        contentText: visibleText(html),
        isOpen: true,
        selection: initialSelection,
      },
      [ShowTextEditorModal({ selector: "#text-editor-modal-story" })],
    ] as const;
  },
  update: (model: Model, next: Message) => {
    if (next._tag === "EditorChanged") {
      return updateResult({
        ...model,
        contentHtml: next.change.html,
        contentText: next.change.text,
      });
    }
    if (next._tag === "EditorSelection") {
      return updateResult({ ...model, selection: next.selection });
    }
    if (next._tag === "EditorCommand") {
      return updateResult(model, [
        FoldkitCommand.mapMessage(
          runTextEditorCommand(`text-editor-modal-story-editor-${next.editor}`, next.request),
          () => commandCompleted,
        ),
      ]);
    }
    if (next._tag === "EditorGenerate" || next._tag === "AskAi") {
      const html = "<p>Here is a concise featured excerpt drafted from the article.</p>";
      return updateResult({ ...model, contentHtml: html, contentText: visibleText(html) });
    }
    if (next._tag === "EditorImage" || next._tag === "EditorCommandCompleted") {
      return updateResult(model);
    }
    const updated = {
      ...model,
      isOpen: next._tag === "TextEditorModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Save"
      ? updateResult(updated, [CloseTextEditorModal({ selector: "#text-editor-modal-story" })])
      : updateResult(updated);
  },
  view: (model: Model, h: Parameters<typeof textEditorModal<Message>>[1]) =>
    textEditorModal(
      {
        contentHtml: model.contentHtml,
        contentText: model.contentText,
        id: "text-editor-modal-story",
        isOpen: model.isOpen,
        onAskAi: action("AskAi"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onEditorChange: editorChanged,
        onEditorCommand: editorCommand,
        onEditorGenerate: editorGenerate,
        onEditorImageChange: (editor) => editorImage(editor),
        onEditorSelectionChange: editorSelection,
        onSave: action("Save"),
        selection: model.selection,
      },
      h,
    ),
});

const definition = makeDefinition("source");
const interactionDefinition = makeDefinition("interaction");
const meta = componentMeta("text-editor-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Text Editor Modal",
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
  ...liveCommandStory(interactionDefinition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog", { name: "Edit featured excerpt" });
    const editor = within(dialog).getByRole("textbox", { name: "Featured excerpt" });
    const textNode = editor.querySelector("p")?.firstChild ?? editor;
    const selection = canvasElement.ownerDocument.defaultView?.getSelection();
    const range = canvasElement.ownerDocument.createRange();
    range.selectNodeContents(textNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
    await userEvent.click(within(dialog).getByRole("button", { name: "Bold ⌘B" }));
    await waitFor(
      () => expect(editor.innerHTML).toMatch(/<(?:b|strong)>Featured excerpt<\/(?:b|strong)>/u),
      { timeout: 3000 },
    );
    const pressedBold = within(dialog).getByRole("button", { name: "Bold ⌘B" });
    await expect(pressedBold).toHaveAttribute("aria-pressed", "true");
  },
};
