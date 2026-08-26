/* oxlint-disable effect/noEffectNever, effect/noReturnInArrow, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/prefer-option-over-null, typescript/no-deprecated -- This internal lifecycle-scoped adapter reproduces the upstream rich editor with Chromium's native contenteditable command surface. */
import * as Effect from "effect/Effect";
import * as Queue from "effect/Queue";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import type { Command } from "foldkit/command";
import * as FoldkitCommand from "foldkit/command";
import type { MountAction } from "foldkit/mount";
import * as Mount from "foldkit/mount";

export interface TextEditorSelection {
  readonly align: "center" | "left" | "right";
  readonly bold: boolean;
  readonly bulletList: boolean;
  readonly color: string;
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly italic: boolean;
  readonly link: boolean;
  readonly underline: boolean;
}

export interface TextEditorChange {
  readonly html: string;
  readonly text: string;
}

export type TextEditorCommandName =
  | "bold"
  | "bulletList"
  | "center"
  | "color"
  | "fontFamily"
  | "fontSize"
  | "image"
  | "italic"
  | "left"
  | "link"
  | "underline";

export interface TextEditorCommandRequest {
  readonly command: TextEditorCommandName;
  readonly value?: string;
}

const EditorChanged = S.Struct({
  _tag: S.Literal("EditorChanged"),
  html: S.String,
  text: S.String,
});
const EditorSelectionChanged = S.Struct({
  _tag: S.Literal("EditorSelectionChanged"),
  align: S.Literals(["center", "left", "right"]),
  color: S.String,
  fontFamily: S.String,
  fontSize: S.String,
  isBold: S.Boolean,
  isBulletList: S.Boolean,
  isItalic: S.Boolean,
  isLink: S.Boolean,
  isUnderline: S.Boolean,
});
type EditorEvent = typeof EditorChanged.Type | typeof EditorSelectionChanged.Type;

const queryState = (command: string): boolean => document.queryCommandState(command);
const queryValue = (command: string): string => document.queryCommandValue(command);

const selectionEvent = (): typeof EditorSelectionChanged.Type => {
  const justifyCenter = queryState("justifyCenter");
  const justifyRight = queryState("justifyRight");
  let align: "center" | "left" | "right" = "left";
  if (justifyCenter) {
    align = "center";
  } else if (justifyRight) {
    align = "right";
  }
  return {
    _tag: "EditorSelectionChanged",
    align,
    color: queryValue("foreColor") || "#181D27",
    fontFamily: queryValue("fontName") || "Inter",
    fontSize: queryValue("fontSize") || "16px",
    isBold: queryState("bold"),
    isBulletList: queryState("insertUnorderedList"),
    isItalic: queryState("italic"),
    isLink: queryState("createLink"),
    isUnderline: queryState("underline"),
  };
};

const ObserveTextEditor = Mount.defineStream(
  "ObserveTextEditor",
  EditorChanged,
  EditorSelectionChanged,
)((element) =>
  Stream.callback<EditorEvent>((queue) =>
    Effect.gen(function* ObserveEditorEvents() {
      const emitChange = () => {
        Queue.offerUnsafe(queue, {
          _tag: "EditorChanged",
          html: element.innerHTML,
          text: element.textContent ?? "",
        });
      };
      const emitSelection = () => {
        const selection = document.getSelection();
        if (selection !== null && element.contains(selection.anchorNode)) {
          Queue.offerUnsafe(queue, selectionEvent());
        }
      };
      yield* Effect.acquireRelease(
        Effect.sync(() => {
          element.addEventListener("input", emitChange);
          document.addEventListener("selectionchange", emitSelection);
          return { emitChange, emitSelection };
        }),
        ({ emitChange: change, emitSelection: selection }) =>
          Effect.sync(() => {
            element.removeEventListener("input", change);
            document.removeEventListener("selectionchange", selection);
          }),
      );
      return yield* Effect.never;
    }),
  ),
);

export const observeTextEditor = <Message>(
  onChange: (change: TextEditorChange) => NoInfer<Message>,
  onSelectionChange: (selection: TextEditorSelection) => NoInfer<Message>,
): MountAction<Message> =>
  Mount.mapMessage(ObserveTextEditor(), (event) => {
    if (event._tag === "EditorChanged") {
      return onChange({ html: event.html, text: event.text });
    }
    return onSelectionChange({
      align: event.align,
      bold: event.isBold,
      bulletList: event.isBulletList,
      color: event.color,
      fontFamily: event.fontFamily,
      fontSize: event.fontSize,
      italic: event.isItalic,
      link: event.isLink,
      underline: event.isUnderline,
    });
  });

const TextEditorCommandCompleted = S.Struct({
  _tag: S.Literal("TextEditorCommandCompleted"),
});
export type TextEditorCommandCompleted = typeof TextEditorCommandCompleted.Type;

const commandNames: Readonly<Record<TextEditorCommandName, string>> = {
  bold: "bold",
  bulletList: "insertUnorderedList",
  center: "justifyCenter",
  color: "foreColor",
  fontFamily: "fontName",
  fontSize: "fontSize",
  image: "insertImage",
  italic: "italic",
  left: "justifyLeft",
  link: "createLink",
  underline: "underline",
};

const resolveCommandValue = (
  editor: HTMLElement,
  command: string,
  inputValue: string | undefined,
): string | undefined => {
  if (command === "foreColor" && inputValue?.startsWith("--") === true) {
    return getComputedStyle(editor).getPropertyValue(inputValue).trim();
  }
  return inputValue;
};

const RunTextEditorCommand = FoldkitCommand.define("RunTextEditorCommand", {
  args: {
    command: S.String,
    editorId: S.String,
    value: S.optional(S.String),
  },
  execute: ({ command, editorId, value }) =>
    Effect.gen(function* ExecuteEditorCommand() {
      const editor = document.querySelector<HTMLElement>(`#${CSS.escape(editorId)}`);
      if (editor === null) {
        return { _tag: "TextEditorCommandCompleted" } as const;
      }
      editor.focus();
      const commandValue = resolveCommandValue(editor, command, value);
      yield* Effect.try(() => document.execCommand(command, false, commandValue)).pipe(
        Effect.ignore,
      );
      editor.dispatchEvent(
        new InputEvent("input", { bubbles: true, inputType: "formatSetBlockTextDirection" }),
      );
      return { _tag: "TextEditorCommandCompleted" } as const;
    }),
  messages: [TextEditorCommandCompleted],
});

export const runTextEditorCommand = (
  editorId: string,
  request: TextEditorCommandRequest,
): Command<TextEditorCommandCompleted> =>
  RunTextEditorCommand({
    command: commandNames[request.command],
    editorId,
    value: request.value,
  });
