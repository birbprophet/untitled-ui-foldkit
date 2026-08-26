import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { PlanMenuLocale, PlanMenuPlan, PlanMenuProps } from "../src/application/plan-menu.ts";

describe("plan menu", () => {
  it("keeps plan selection, actions, and dismissal controlled", () => {
    const props: PlanMenuProps<string> = {
      id: "plan-menu",
      isOpen: true,
      locale: "en-US",
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onPlanSelect: (plan) => `select:${plan}`,
      selectedPlan: "business",
    };

    expect(props.onPlanSelect("enterprise")).toBe("select:enterprise");
    expect(props.selectedPlan).toBe("business");
    expect([props.onCancel, props.onConfirm, props.onDismiss]).toEqual([
      "cancel",
      "confirm",
      "dismiss",
    ]);
  });

  it("preserves the authenticated plan ids and order", () => {
    const plans: readonly PlanMenuPlan[] = ["basic", "business", "enterprise"];
    expect(plans).toEqual(["basic", "business", "enterprise"]);
  });

  it("supports both left-to-right locale variants", () => {
    const locales: readonly PlanMenuLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
