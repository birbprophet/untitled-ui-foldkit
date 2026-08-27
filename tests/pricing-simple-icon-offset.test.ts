import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleIconOffset } from "../src/marketing/pricing-simple-icon-offset.ts";

describe("pricing simple icon offset", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleIconOffset).toBeTypeOf("function");
  });
});
