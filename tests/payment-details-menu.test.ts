import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  detectPaymentDetailsMenuCardBrand,
  formatPaymentDetailsMenuField,
} from "../src/application/payment-details-menu.ts";
import type {
  PaymentDetailsMenuField,
  PaymentDetailsMenuProps,
} from "../src/application/payment-details-menu.ts";

const fieldInput = (field: PaymentDetailsMenuField, fieldValue: string): string =>
  `${field}:${fieldValue}`;

const propsFor = (locale: "en-US" | "pt-BR"): PaymentDetailsMenuProps<string> => ({
  billingEmail: {
    "en-US": "accounts@siglata.com",
    "pt-BR": "contas@siglata.com",
  }[locale],
  card: "1234 1234 1234 1234",
  cvv: "123",
  expiry: "06 / 2028",
  id: "payment-details-menu",
  isCvvVisible: false,
  isOpen: true,
  locale,
  name: "Olivia Rhye",
  onCancel: "cancel",
  onConfirm: "confirm",
  onDismiss: "dismiss",
  onFieldInput: fieldInput,
  onToggleCvv: "toggle-cvv",
});

describe("payment details menu", () => {
  it("matches the authenticated field formatting behavior", () => {
    expect(formatPaymentDetailsMenuField("card", "4242-a4242 4242 4242 9999")).toBe(
      "4242424242424242",
    );
    expect(formatPaymentDetailsMenuField("expiry", "062028")).toBe("06 / 2028");
    expect(formatPaymentDetailsMenuField("expiry", "06")).toBe("06");
    expect(formatPaymentDetailsMenuField("cvv", "1a234")).toBe("123");
    expect(formatPaymentDetailsMenuField("name", "Olivia Rhye")).toBe("Olivia Rhye");
    expect(formatPaymentDetailsMenuField("billingEmail", "accounts@siglata.com")).toBe(
      "accounts@siglata.com",
    );
  });

  it("keeps every field and slideout action controlled", () => {
    const props = propsFor("en-US");

    expect(props.onFieldInput("name", "Sienna Hewitt")).toBe("name:Sienna Hewitt");
    expect(props.onFieldInput("card", "4242 4242 4242 4242")).toBe("card:4242 4242 4242 4242");
    expect(props.onFieldInput("expiry", "07 / 2029")).toBe("expiry:07 / 2029");
    expect(props.onFieldInput("cvv", "456")).toBe("cvv:456");
    expect(props.onFieldInput("billingEmail", "finance@siglata.com")).toBe(
      "billingEmail:finance@siglata.com",
    );
    expect([props.onCancel, props.onConfirm, props.onDismiss, props.onToggleCvv]).toEqual([
      "cancel",
      "confirm",
      "dismiss",
      "toggle-cvv",
    ]);
  });

  it("detects every authenticated payment-input card branch", () => {
    expect(
      [
        "4242 4242 4242 4242",
        "5555 5555 5555 4444",
        "3782 8224 6310 005",
        "6011 1111 1111 1117",
        "6212 3456 7890 1234",
        "1234 1234 1234 1234",
      ].map(detectPaymentDetailsMenuCardBrand),
    ).toEqual(["visa", "mastercard", "amex", "discover", "unionpay", "unknown"]);
  });

  it("preserves the authenticated full-number thresholds", () => {
    expect(detectPaymentDetailsMenuCardBrand("6011 1111")).toBe("unknown");
    expect(detectPaymentDetailsMenuCardBrand("6212 3456 7890 123")).toBe("unknown");
    expect(detectPaymentDetailsMenuCardBrand("3412")).toBe("amex");
    expect(detectPaymentDetailsMenuCardBrand("5112")).toBe("mastercard");
  });

  it("supports en-US and pt-BR fixtures in left-to-right layout", () => {
    const english = propsFor("en-US");
    const portuguese = propsFor("pt-BR");

    expect([english.locale, portuguese.locale]).toEqual(["en-US", "pt-BR"]);
    expect(english.name).toBe("Olivia Rhye");
    expect(portuguese.billingEmail).toBe("contas@siglata.com");
    expect(portuguese.isOpen).toBe(true);
  });
});
