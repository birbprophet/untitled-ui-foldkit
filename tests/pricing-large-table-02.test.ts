import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingLargeTable02 } from "../src/marketing/pricing-large-table-02.ts";

describe("pricing large table 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingLargeTable02).toBeTypeOf("function");
  });
});
