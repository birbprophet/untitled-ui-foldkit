import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingAbstractAngles } from "../src/marketing/pricing-abstract-angles.ts";

describe("pricing abstract angles", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingAbstractAngles).toBeTypeOf("function");
  });
});
