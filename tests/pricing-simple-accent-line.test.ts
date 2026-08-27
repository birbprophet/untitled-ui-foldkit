import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleAccentLine } from "../src/marketing/pricing-simple-accent-line.ts";

describe("pricing simple accent line", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleAccentLine).toBeTypeOf("function");
  });
});
