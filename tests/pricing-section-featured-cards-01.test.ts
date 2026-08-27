import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionFeaturedCards01 } from "../src/marketing/pricing-section-featured-cards-01.ts";

describe("pricing section featured cards 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionFeaturedCards01).toBeTypeOf("function");
  });
});
