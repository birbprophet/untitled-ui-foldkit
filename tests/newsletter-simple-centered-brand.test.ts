import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterSimpleCenteredBrand } from "../src/marketing/newsletter-simple-centered-brand.ts";

describe("newsletter simple centered brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterSimpleCenteredBrand).toBeTypeOf("function");
  });
});
