import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleBanner } from "../src/marketing/pricing-simple-banner.ts";

describe("pricing simple banner", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleBanner).toBeTypeOf("function");
  });
});
