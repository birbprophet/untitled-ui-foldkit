import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionFeaturedCards02 } from "../src/marketing/pricing-section-featured-cards-02.ts";

describe("pricing section featured cards 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionFeaturedCards02).toBeTypeOf("function");
  });
});
