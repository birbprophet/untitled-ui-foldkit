import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLeftBrand } from "../src/marketing/cta-simple-left-brand.ts";

describe("cta simple left brand", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLeftBrand).toBeTypeOf("function");
  });
});
