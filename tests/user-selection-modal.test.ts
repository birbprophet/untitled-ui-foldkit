import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { UserSelectionModalProps } from "../src/application/user-selection-modal.ts";

describe("user selection modal", () => {
  it("keeps seat count and dialog actions controlled", () => {
    const props: UserSelectionModalProps<string> = {
      count: 32,
      id: "purchase-seats",
      isOpen: true,
      locale: "en-US",
      onCancel: "cancel",
      onDecrease: "decrease",
      onDismiss: "dismiss",
      onIncrease: "increase",
      onPurchase: "purchase",
    };

    expect(props.count).toBe(32);
    expect(props.onDecrease).toBe("decrease");
    expect(props.onIncrease).toBe("increase");
    expect(props.onPurchase).toBe("purchase");
    expect(props.locale).toBe("en-US");
  });

  it("supports the pt-BR localized variant", () => {
    const props: UserSelectionModalProps<string> = {
      count: 1,
      id: "comprar-assentos",
      isOpen: true,
      locale: "pt-BR",
      onCancel: "cancelar",
      onDecrease: "diminuir",
      onDismiss: "fechar",
      onIncrease: "aumentar",
      onPurchase: "comprar",
    };

    expect(props.count).toBe(1);
    expect(props.locale).toBe("pt-BR");
    expect(props.onDismiss).toBe("fechar");
  });
});
