import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  AIAssistantMessageMenuDecision,
  AIAssistantMessageMenuLocale,
  AIAssistantMessageMenuProps,
} from "../src/application/ai-assistant-message-menu.ts";

describe("AI assistant message menu", () => {
  it("keeps visibility, composer text, and every interaction controlled", () => {
    const props: AIAssistantMessageMenuProps<string> = {
      id: "assistant-menu",
      inputValue: "Move the meeting to Friday",
      isOpen: true,
      locale: "en-US",
      onAccount: "account",
      onAttach: "attach",
      onDecision: (decision: AIAssistantMessageMenuDecision) => `decision:${decision}`,
      onDismiss: "dismiss",
      onInput: (value) => `input:${value}`,
      onMessageAction: (id, action) => `message:${id}:${action}`,
      onMicrophone: "microphone",
      onShortcuts: "shortcuts",
      onSubmit: "submit",
    };

    expect(props.onInput("Friday at 3 PM")).toBe("input:Friday at 3 PM");
    expect(props.onDecision("cancel")).toBe("decision:cancel");
    expect(props.onDecision("update")).toBe("decision:update");
    expect(
      (["ai", "copy", "download", "edit", "play", "reply"] as const).map((action) =>
        props.onMessageAction("message-007", action),
      ),
    ).toEqual([
      "message:message-007:ai",
      "message:message-007:copy",
      "message:message-007:download",
      "message:message-007:edit",
      "message:message-007:play",
      "message:message-007:reply",
    ]);
    expect([
      props.onAccount,
      props.onAttach,
      props.onDismiss,
      props.onMicrophone,
      props.onShortcuts,
      props.onSubmit,
    ]).toEqual(["account", "attach", "dismiss", "microphone", "shortcuts", "submit"]);
    expect(props.inputValue).toBe("Move the meeting to Friday");
  });

  it("supports only the two approved left-to-right locales", () => {
    const locales: readonly AIAssistantMessageMenuLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
