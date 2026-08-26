import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  TextEditorModalEditor,
  TextEditorModalProps,
} from "../src/application/text-editor-modal.ts";

const selection = {
  align: "left",
  bold: false,
  bulletList: false,
  color: "#181D27",
  fontFamily: "Inter",
  fontSize: "16px",
  italic: false,
  link: false,
  underline: false,
} as const;
const centerSelection = {
  align: "center",
  bold: false,
  bulletList: false,
  color: "#181D27",
  fontFamily: "Inter",
  fontSize: "16px",
  italic: false,
  link: false,
  underline: false,
} as const;

describe("text editor modal", () => {
  it("keeps document, selection, editor commands, and modal actions controlled", () => {
    const props: TextEditorModalProps<string> = {
      contentHtml: "<p>Featured excerpt</p>",
      contentText: "Featured excerpt",
      id: "text-editor",
      isOpen: true,
      onAskAi: "ask-ai",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onEditorChange: (editor, change) => `${editor}:${change.text}`,
      onEditorCommand: (editor, request) => `${editor}:${request.command}`,
      onEditorGenerate: (editor) => `${editor}:generate`,
      onEditorImageChange: (editor, files) => `${editor}:${String(files.length)}`,
      onEditorSelectionChange: (editor, next) => `${editor}:${next.align}`,
      onSave: "save",
      selection,
    };
    const editors: readonly TextEditorModalEditor[] = ["mobile", "desktop"];
    expect(editors).toEqual(["mobile", "desktop"]);
    expect(props.onEditorChange("desktop", { html: "<p>Changed</p>", text: "Changed" })).toBe(
      "desktop:Changed",
    );
    expect(props.onEditorCommand("mobile", { command: "bold" })).toBe("mobile:bold");
    expect(props.onEditorSelectionChange("desktop", centerSelection)).toBe("desktop:center");
  });
});
