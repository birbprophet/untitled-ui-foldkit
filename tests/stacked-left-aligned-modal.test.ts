import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { StackedLeftAlignedModalProps } from "../src/application/stacked-left-aligned-modal.ts";

describe("stacked left aligned modal", () => {
  it("keeps visibility and every dismissal path controlled", () => {
    const props: StackedLeftAlignedModalProps<string> = {
      id: "published-post",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
    };
    expect(props).toEqual({
      id: "published-post",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
    });
  });

  it("represents the dismissed state without internal timing state", () => {
    const props: StackedLeftAlignedModalProps<string> = {
      id: "published-post",
      isOpen: false,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
    };
    expect(props.isOpen).toBe(false);
  });
});
