import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionFeaturedCards03 } from "../src/marketing/pricing-section-featured-cards-03.ts";

describe("pricing section featured cards 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionFeaturedCards03).toBeTypeOf("function");
  });
});
