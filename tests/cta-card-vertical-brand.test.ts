import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaCardVerticalBrand } from "../src/marketing/cta-card-vertical-brand.ts";

describe("cta-card-vertical-brand", () => {
  it("exposes the renderer", () => {
    expect(ctaCardVerticalBrand).toBeTypeOf("function");
  });
});
