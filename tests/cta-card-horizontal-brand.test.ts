import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaCardHorizontalBrand } from "../src/marketing/cta-card-horizontal-brand.ts";

describe("cta-card-horizontal-brand", () => {
  it("exposes the renderer", () => {
    expect(ctaCardHorizontalBrand).toBeTypeOf("function");
  });
});
