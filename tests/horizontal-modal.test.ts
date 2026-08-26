import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { HorizontalModalProps } from "../src/application/horizontal-modal.ts";

describe("horizontal modal", () => {
  it("keeps acknowledgement and actions controlled", () => {
    const props: HorizontalModalProps<string> = {
      hideAgain: false,
      id: "published",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onToggleHideAgain: "toggle",
    };
    expect(props.onConfirm).toBe("confirm");
    expect(props.onToggleHideAgain).toBe("toggle");
  });
});
