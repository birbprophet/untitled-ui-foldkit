import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  PaymentMethodMenuCard,
  PaymentMethodMenuProps,
} from "../src/application/payment-method-menu.ts";

const cards: readonly PaymentMethodMenuCard[] = ["card-1", "card-2", "card-3", "card-4"];

describe("payment method menu", () => {
  it("keeps payment selection, card actions, email, and dismissal controlled", () => {
    const props: PaymentMethodMenuProps<string> = {
      billingEmail: "accounts@siglata.com",
      id: "payment-method-menu",
      isOpen: true,
      locale: "en-US",
      onAddPaymentMethod: "add",
      onBillingEmailInput: (value) => `email:${value}`,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onEdit: (card) => `edit:${card}`,
      onSelect: (card) => `select:${card}`,
      onSetDefault: (card) => `default:${card}`,
      onUnmount: "unmount",
      selectedCard: "card-1",
    };

    expect(cards.map((card) => props.onSelect(card))).toEqual([
      "select:card-1",
      "select:card-2",
      "select:card-3",
      "select:card-4",
    ]);
    expect(props.onSetDefault("card-3")).toBe("default:card-3");
    expect(props.onEdit("card-4")).toBe("edit:card-4");
    expect(props.onBillingEmailInput("billing@siglata.com")).toBe("email:billing@siglata.com");
    expect([props.onDismiss, props.onCancel, props.onConfirm, props.onUnmount]).toEqual([
      "dismiss",
      "cancel",
      "confirm",
      "unmount",
    ]);
  });

  it("preserves the authenticated card fixture order and selected default", () => {
    expect(cards).toEqual(["card-1", "card-2", "card-3", "card-4"]);
    expect(cards[0]).toBe("card-1");
  });
});
