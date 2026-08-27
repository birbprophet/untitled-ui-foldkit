import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingLargeTable01 } from "../src/marketing/pricing-large-table-01.ts";

describe("pricing large table 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingLargeTable01).toBeTypeOf("function");
  });
});
