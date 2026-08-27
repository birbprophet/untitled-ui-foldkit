import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionSimpleCards02 } from "../src/marketing/pricing-section-simple-cards-02.ts";

describe("pricing section simple cards 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionSimpleCards02).toBeTypeOf("function");
  });
});
