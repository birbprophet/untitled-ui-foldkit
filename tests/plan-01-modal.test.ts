import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Plan01, Plan01ModalProps } from "../src/application/plan-01-modal.ts";

const select = (plan: Plan01): string => `select:${plan}`;

describe("plan 01 modal", () => {
  it("keeps plan selection and dismissal controlled", () => {
    const props: Plan01ModalProps<string> = {
      id: "plan-01",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onSelect: select,
      selectedPlan: "basic",
    };

    expect(props.onSelect("business")).toBe("select:business");
    expect(props.onSelect("enterprise")).toBe("select:enterprise");
  });
});
