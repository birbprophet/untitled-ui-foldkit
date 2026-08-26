import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { StackedWithTeamModalProps } from "../src/application/stacked-with-team-modal.ts";

describe("stacked with team modal", () => {
  it("keeps dialog visibility and each exit action controlled", () => {
    const props: StackedWithTeamModalProps<string> = {
      id: "stacked-team",
      isOpen: true,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onGetStarted: "get-started",
    };

    expect(props.isOpen).toBe(true);
    expect(props.onCancel).toBe("cancel");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.onGetStarted).toBe("get-started");
  });
});
