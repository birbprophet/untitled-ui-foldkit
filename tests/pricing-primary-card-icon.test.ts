import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingPrimaryCardIcon } from "../src/marketing/pricing-primary-card-icon.ts";

describe("pricing primary card icon", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingPrimaryCardIcon).toBeTypeOf("function");
  });
});
