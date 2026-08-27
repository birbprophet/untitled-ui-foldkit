/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/require-is-prefix-for-boolean-schema-field -- Storybook play functions are promise-based and the model mirrors the upstream component props. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import type { Command } from "foldkit/command";
import * as FoldkitCommand from "foldkit/command";
import { runTextEditorCommand, textEditor } from "../../../src/base.ts";
import type {
  TextEditorChange,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory, matrix } from "../story.ts";

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
const Args = S.Struct({
  html: S.String,
  isDisabled: S.Boolean,
  isInvalid: S.Boolean,
  label: S.String,
  limit: S.Number,
  placeholder: S.String,
  toolbar: S.Literals(["simple", "advanced"]),
});
const Model = S.Struct({
  ...Args.fields,
  editorId: S.String,
  selection: Selection,
  text: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Changed"; change: TextEditorChange }>
  | Readonly<{ _tag: "CommandCompleted" }>
  | Readonly<{ _tag: "CommandRequested"; request: TextEditorCommandRequest }>
  | Readonly<{ _tag: "Generate" }>
  | Readonly<{ _tag: "ImageSelected" }>
  | Readonly<{ _tag: "SelectionChanged"; selection: TextEditorSelection }>;

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

const visibleText = (html: string): string => html.replaceAll(/<[^>]+>/gu, "").trim();
const init = (args: Args): Model => ({
  ...args,
  editorId: "untitled-text-editor",
  selection: initialSelection,
  text: visibleText(args.html),
});
const changed = (change: TextEditorChange): Message => ({ _tag: "Changed", change });
const commandRequested = (request: TextEditorCommandRequest): Message => ({
  _tag: "CommandRequested",
  request,
});
const selectionChanged = (selection: TextEditorSelection): Message => ({
  _tag: "SelectionChanged",
  selection,
});
const commandCompleted: Message = { _tag: "CommandCompleted" };
const generate: Message = { _tag: "Generate" };
const imageSelected: Message = { _tag: "ImageSelected" };
const updateResult = (
  model: Model,
  commands: readonly Command<Message>[] = [],
): readonly [Model, readonly Command<Message>[]] => [model, commands];

const update = (model: Model, message: Message): readonly [Model, readonly Command<Message>[]] =>
  Match.value(message).pipe(
    Match.when({ _tag: "Changed" }, ({ change }) =>
      updateResult({ ...model, html: change.html, text: change.text }),
    ),
    Match.when({ _tag: "SelectionChanged" }, ({ selection }) =>
      updateResult({ ...model, selection }),
    ),
    Match.when({ _tag: "CommandRequested" }, ({ request }) =>
      updateResult(model, [
        FoldkitCommand.mapMessage(
          runTextEditorCommand(model.editorId, request),
          () => commandCompleted,
        ),
      ]),
    ),
    Match.when({ _tag: "Generate" }, () => {
      const generated = "<p>Here is a concise draft for the quarterly report.</p>";
      return updateResult({ ...model, html: generated, text: visibleText(generated) });
    }),
    Match.when({ _tag: "ImageSelected" }, () => updateResult(model)),
    Match.when({ _tag: "CommandCompleted" }, () => updateResult(model)),
    Match.exhaustive,
  );

const specimen = (
  model: Model,
  h: Parameters<typeof textEditor<Message>>[1],
  editorId = model.editorId,
) =>
  textEditor(
    {
      ...model,
      editorId,
      onChange: changed,
      onCommand: commandRequested,
      onGenerate: generate,
      onImageChange: () => imageSelected,
      onSelectionChange: selectionChanged,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: Args) => [init(args), []] as const,
  update,
  view: (model: Model, h: Parameters<typeof textEditor<Message>>[1]) => specimen(model, h),
} as const;

const defaultArgs: Args = {
  html: "<p>We’re excited to share the latest product updates with the team.</p>",
  isDisabled: false,
  isInvalid: false,
  label: "Description",
  limit: 500,
  placeholder: "Write something...",
  toolbar: "simple",
};

export default {
  ...componentMeta("text-editor"),
  title: "Untitled UI/Base/Text Editor",
};

export const AllVariants = {
  ...liveCommandStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Simple",
            [
              h.div(
                [h.Class("w-160")],
                [specimen({ ...model, toolbar: "simple" }, h, "editor-simple")],
              ),
            ],
          ],
          [
            "Advanced",
            [
              h.div(
                [h.Class("w-200")],
                [specimen({ ...model, toolbar: "advanced" }, h, "editor-advanced")],
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveCommandStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Empty",
            [
              h.div(
                [h.Class("w-160")],
                [specimen({ ...model, html: "", text: "" }, h, "editor-empty")],
              ),
            ],
          ],
          [
            "Invalid",
            [
              h.div(
                [h.Class("w-160")],
                [specimen({ ...model, isInvalid: true }, h, "editor-invalid")],
              ),
            ],
          ],
          [
            "Disabled",
            [
              h.div(
                [h.Class("w-160")],
                [specimen({ ...model, isDisabled: true }, h, "editor-disabled")],
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveCommandStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-200")], [specimen({ ...model, toolbar: "advanced" }, h)])],
      ),
  }),
  args: { ...defaultArgs, toolbar: "advanced" },
};

export const Responsive = {
  ...liveCommandStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      h.div([h.Class("w-full max-w-200 p-4")], [specimen({ ...model, toolbar: "advanced" }, h)]),
  }),
  args: { ...defaultArgs, toolbar: "advanced" },
};

export const Interactions = {
  ...liveCommandStory<typeof Args.Type, Model, Message>(definition),
  args: { ...defaultArgs, html: "<p>Quarterly report</p>", toolbar: "advanced" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const editor = await canvas.findByRole("textbox", { name: "Description" });
    const textNode = editor.querySelector("p")?.firstChild ?? editor;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(textNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
    await userEvent.click(await canvas.findByRole("button", { name: "Bold ⌘B" }));
    await waitFor(
      () => expect(editor.innerHTML).toMatch(/<(?:b|strong)>Quarterly report<\/(?:b|strong)>/u),
      { timeout: 3000 },
    );
    await expect(await canvas.findByRole("button", { name: "Bold ⌘B" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    editor.focus();
  },
};
