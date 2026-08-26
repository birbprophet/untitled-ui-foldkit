import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  AIAssistantIntroLocale,
  AIAssistantIntroMenuProps,
  AIAssistantIntroPrompt,
} from "../src/application/ai-assistant-intro-menu.ts";

describe("AI assistant intro menu", () => {
  it("keeps visibility, composer, prompts, and actions controlled", () => {
    const props: AIAssistantIntroMenuProps<string> = {
      accountName: "Olivia",
      accountSeed: "olivia-ai-assistant-intro",
      id: "assistant-intro",
      inputValue: "Help me make a plan.",
      isOpen: true,
      locale: "en-US",
      onAccount: "account",
      onAttach: "attach",
      onDismiss: "dismiss",
      onInput: (value) => `input:${value}`,
      onMicrophone: "microphone",
      onPrompt: (prompt: AIAssistantIntroPrompt) => `prompt:${prompt}`,
      onShortcuts: "shortcuts",
      onSubmit: "submit",
      userName: "Olivia",
    };

    expect(props.onInput("Build a launch checklist")).toBe("input:Build a launch checklist");
    expect(props.onPrompt("make-plan")).toBe("prompt:make-plan");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.inputValue).toBe("Help me make a plan.");
  });

  it("supports the exact six prompt actions", () => {
    const prompts: readonly AIAssistantIntroPrompt[] = [
      "create-image",
      "analyze-data",
      "make-plan",
      "summarize-text",
      "help-write",
      "more",
    ];
    expect(prompts).toEqual([
      "create-image",
      "analyze-data",
      "make-plan",
      "summarize-text",
      "help-write",
      "more",
    ]);
  });

  it("supports both left-to-right locale variants", () => {
    const locales: readonly AIAssistantIntroLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
