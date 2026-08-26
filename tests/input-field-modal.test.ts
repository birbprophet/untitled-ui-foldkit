import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { InputFieldModalProps } from "../src/application/input-field-modal.ts";

describe("input field modal", () => {
  it("keeps the field and actions controlled", () => {
    const props: InputFieldModalProps<string> = {
      id: "input-field",
      isOpen: true,
      name: "Website redesign",
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onNameInput: (value) => `name:${value}`,
    };
    expect(props.onNameInput("Annual report")).toBe("name:Annual report");
    expect(props.onConfirm).toBe("confirm");
  });
});
