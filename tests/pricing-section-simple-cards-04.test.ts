import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSectionSimpleCards04 } from "../src/marketing/pricing-section-simple-cards-04.ts";

describe("pricing section simple cards 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSectionSimpleCards04).toBeTypeOf("function");
  });
});
