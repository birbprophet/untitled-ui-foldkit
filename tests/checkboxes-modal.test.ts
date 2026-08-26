import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  CheckboxesModalChannel,
  CheckboxesModalProps,
} from "../src/application/checkboxes-modal.ts";

describe("checkboxes modal", () => {
  it("keeps selection and dialog actions controlled", () => {
    const selectedChannels: readonly CheckboxesModalChannel[] = ["twitter", "medium"];
    const props: CheckboxesModalProps<string> = {
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
    expect(props.onConfirm).toBe("confirm");
  });
});
