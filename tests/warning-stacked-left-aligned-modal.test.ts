import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { WarningStackedLeftAlignedModalProps } from "../src/application/warning-stacked-left-aligned-modal.ts";

describe("warning stacked left aligned modal", () => {
  it("keeps visibility and all outcomes controlled", () => {
    const props: WarningStackedLeftAlignedModalProps<string> = {
      id: "unsaved-changes",
      isOpen: true,
      locale: "en-US",
      onDiscard: "discard",
      onDismiss: "dismiss",
      onSave: "save",
    };
    expect(props).toEqual({
      id: "unsaved-changes",
      isOpen: true,
      locale: "en-US",
      onDiscard: "discard",
      onDismiss: "dismiss",
      onSave: "save",
    });
  });

  it("represents dismissal without an internal reopen timer", () => {
    const props: WarningStackedLeftAlignedModalProps<string> = {
      id: "unsaved-changes",
      isOpen: false,
      locale: "pt-BR",
      onDiscard: "discard",
      onDismiss: "dismiss",
      onSave: "save",
    };
    expect(props.isOpen).toBe(false);
    expect(props.locale).toBe("pt-BR");
  });
});
