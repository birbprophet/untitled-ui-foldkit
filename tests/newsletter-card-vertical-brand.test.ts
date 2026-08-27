import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterCardVerticalBrand } from "../src/marketing/newsletter-card-vertical-brand.ts";

describe("newsletter card vertical brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterCardVerticalBrand).toBeTypeOf("function");
  });
});
