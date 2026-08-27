import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterCardHorizontalBrand } from "../src/marketing/newsletter-card-horizontal-brand.ts";

describe("newsletter card horizontal brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterCardHorizontalBrand).toBeTypeOf("function");
  });
});
