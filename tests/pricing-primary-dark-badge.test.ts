import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingPrimaryDarkBadge } from "../src/marketing/pricing-primary-dark-badge.ts";

describe("pricing primary dark badge", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingPrimaryDarkBadge).toBeTypeOf("function");
  });
});
