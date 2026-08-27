import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingPrimaryCardSimple } from "../src/marketing/pricing-primary-card-simple.ts";

describe("pricing primary card simple", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingPrimaryCardSimple).toBeTypeOf("function");
  });
});
