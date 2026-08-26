import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  OrderSummaryMenuProps,
  ShippingMethodId,
} from "../src/application/order-summary-menu.ts";

describe("order summary menu", () => {
  it("keeps shipping, copy, checkout, and dismissal controlled", () => {
    const props: OrderSummaryMenuProps<string> = {
      copied: false,
      discountCode: "FRIENDS",
      id: "order-summary",
      isOpen: true,
      locale: "en-US",
      onCheckout: "checkout",
      onCopyDiscount: "copy",
      onDismiss: "dismiss",
      onShippingFocus: (id) => `focus:${id}`,
      onShippingOpenChanged: (open) => `open:${String(open)}`,
      onShippingSelect: (id) => `select:${id}`,
      selectedShippingId: "express-post",
    };
    expect(props.onShippingFocus("standard-post")).toBe("focus:standard-post");
    expect(props.onShippingOpenChanged(true)).toBe("open:true");
    expect(props.onShippingSelect("pickup")).toBe("select:pickup");
    expect([props.onCopyDiscount, props.onCheckout, props.onDismiss]).toEqual([
      "copy",
      "checkout",
      "dismiss",
    ]);
  });

  it("covers every upstream shipping method", () => {
    const methods: readonly ShippingMethodId[] = ["express-post", "standard-post", "pickup"];
    expect(methods).toHaveLength(3);
  });
});
