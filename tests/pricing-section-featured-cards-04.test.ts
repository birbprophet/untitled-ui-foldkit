import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionFeaturedCards04 } from "../src/marketing/pricing-section-featured-cards-04.ts";

describe("pricing section featured cards 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionFeaturedCards04).toBeTypeOf("function");
  });
});
