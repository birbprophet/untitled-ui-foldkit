import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  AIAssistantModalProps,
  AssistantPrompt,
} from "../src/application/ai-assistant-modal.ts";

describe("AI assistant modal", () => {
  it("keeps composer, prompts, actions, and visibility controlled", () => {
    const props: AIAssistantModalProps<string> = {
      accountAvatarUrl: "/agents/olivia.svg",
      accountName: "Olivia",
      brand: { mark: { alt: "Brand logo", src: "/brand/logo.svg" } },
      id: "assistant",
      inputValue: "Build a launch checklist",
      isOpen: true,
      onAccount: "account",
      onAttach: "attach",
      onDismiss: "dismiss",
      onInput: (value) => `input:${value}`,
      onMicrophone: "microphone",
      onPrompt: (prompt: AssistantPrompt) => `prompt:${prompt}`,
      onShortcuts: "shortcuts",
      onSubmit: "submit",
      userName: "Olivia",
    };
    expect(props.onInput("Hello")).toBe("input:Hello");
    expect(props.onPrompt("make-plan")).toBe("prompt:make-plan");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.inputValue).toBe("Build a launch checklist");
  });
});
