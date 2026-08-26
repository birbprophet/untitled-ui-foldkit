import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { DestructiveStackedLeftAlignedModalProps } from "../src/application/destructive-stacked-left-aligned-modal.ts";

describe("destructive stacked left aligned modal", () => {
  it("keeps visibility and destructive actions controlled", () => {
    const props: DestructiveStackedLeftAlignedModalProps<string> = {
      id: "delete-post",
      isOpen: true,
      onCancel: "cancel",
      onDelete: "delete",
      onDismiss: "dismiss",
    };
    expect(props.isOpen).toBe(true);
    expect(props.onDelete).toBe("delete");
  });
});
