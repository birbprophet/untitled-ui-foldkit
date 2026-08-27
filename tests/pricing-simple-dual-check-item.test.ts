import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleDualCheckItem } from "../src/marketing/pricing-simple-dual-check-item.ts";

describe("pricing simple dual check item", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleDualCheckItem).toBeTypeOf("function");
  });
});
