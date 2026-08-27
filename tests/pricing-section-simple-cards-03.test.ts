import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionSimpleCards03 } from "../src/marketing/pricing-section-simple-cards-03.ts";

describe("pricing section simple cards 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionSimpleCards03).toBeTypeOf("function");
  });
});
