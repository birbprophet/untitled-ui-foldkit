import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleIcon } from "../src/marketing/pricing-simple-icon.ts";

describe("pricing simple icon", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleIcon).toBeTypeOf("function");
  });
});
