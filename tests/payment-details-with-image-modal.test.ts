/* oxlint-disable @rikalabs/no-hardcoded-secrets -- The values are inert upstream payment fixtures. */
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { PaymentDetailsWithImageModalProps } from "../src/application/payment-details-with-image-modal.ts";

describe("payment details with image modal", () => {
  it("keeps the preview fields and actions controlled", () => {
    const props: PaymentDetailsWithImageModalProps<string> = {
      card: "1234 1234 1234 1234",
      cvv: "123",
      expiry: "06 / 2028",
      id: "payment-details-with-image",
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
    expect(props.onFieldInput("name", "Olivia")).toBe("name:Olivia");
    expect(props.onFieldInput("expiry", "07 / 2029")).toBe("expiry:07 / 2029");
  });
});
