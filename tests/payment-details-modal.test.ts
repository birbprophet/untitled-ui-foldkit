import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { PaymentDetailsModalProps } from "../src/application/payment-details-modal.ts";

describe("payment details modal", () => {
  it("keeps every payment field and action controlled", () => {
    const props: PaymentDetailsModalProps<string> = {
      card: "1234 1234 1234 1234",
      cvv: "123",
      expiry: "06 / 2028",
      id: "payment-details",
      isCvvFocused: false,
      isOpen: true,
      name: "Olivia Rhye",
      onCancel: "cancel",
      onCvvBlur: "cvv-blur",
      onCvvFocus: "cvv-focus",
      onDismiss: "dismiss",
      onFieldInput: (field, value) => `${field}:${value}`,
      onUpdate: "update",
    };
    expect(props.onFieldInput("expiry", "07 / 2029")).toBe("expiry:07 / 2029");
    expect(props.onFieldInput("card", "4242")).toBe("card:4242");
  });
});
