import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionSimpleCards01 } from "../src/marketing/pricing-section-simple-cards-01.ts";

describe("pricing section simple cards 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionSimpleCards01).toBeTypeOf("function");
  });
});
