import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  PaymentMethod,
  PaymentMethodModalProps,
} from "../src/application/payment-method-modal.ts";

const action =
  (name: string) =>
  (method: PaymentMethod): string =>
    `${name}:${method}`;

describe("payment method modal", () => {
  it("keeps selection and payment actions controlled", () => {
    const props: PaymentMethodModalProps<string> = {
      id: "payment-method",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onEdit: action("edit"),
      onSelect: action("select"),
      onSetDefault: action("default"),
      selectedMethod: "visa-primary",
    };

    expect(props.onSelect("mastercard")).toBe("select:mastercard");
    expect(props.onEdit("visa-secondary")).toBe("edit:visa-secondary");
    expect(props.onSetDefault("visa-primary")).toBe("default:visa-primary");
  });
});
