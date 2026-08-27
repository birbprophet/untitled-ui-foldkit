import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleCenteredBrand } from "../src/marketing/cta-simple-centered-brand.ts";

describe("cta-simple-centered-brand", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleCenteredBrand).toBeTypeOf("function");
  });
});
