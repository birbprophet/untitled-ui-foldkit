import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { DestructiveHorizontalModalProps } from "../src/application/destructive-horizontal-modal.ts";

describe("destructive horizontal modal", () => {
  it("keeps visibility, selection, and actions controlled", () => {
    const props: DestructiveHorizontalModalProps<string> = {
      hideAgain: true,
      id: "delete-post",
      isOpen: true,
      onCancel: "cancel",
      onDelete: "delete",
      onDismiss: "dismiss",
      onToggleHideAgain: "toggle",
    };
    expect(props.hideAgain).toBe(true);
    expect(props.onDelete).toBe("delete");
  });
});
