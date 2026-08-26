import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { TogglesModalChannel, TogglesModalProps } from "../src/application/toggles-modal.ts";

describe("toggles modal", () => {
  it("keeps channel selection and dialog actions controlled", () => {
    const selectedChannels: readonly TogglesModalChannel[] = ["twitter", "medium"];
    const props: TogglesModalProps<string> = {
      id: "published",
      isOpen: true,
      messageForToggle: (channel) => `toggle-${channel}`,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      selectedChannels,
    };

    expect(props.selectedChannels).toEqual(["twitter", "medium"]);
    expect(props.messageForToggle("facebook")).toBe("toggle-facebook");
    expect(props.onCancel).toBe("cancel");
    expect(props.onConfirm).toBe("confirm");
  });
});
