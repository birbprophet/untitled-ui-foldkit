import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterSimpleLeftBrand } from "../src/marketing/newsletter-simple-left-brand.ts";

describe("newsletter simple left brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterSimpleLeftBrand).toBeTypeOf("function");
  });
});
