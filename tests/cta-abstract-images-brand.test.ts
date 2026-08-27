import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaAbstractImagesBrand } from "../src/marketing/cta-abstract-images-brand.ts";

describe("cta-abstract-images-brand", () => {
  it("exposes the renderer", () => {
    expect(ctaAbstractImagesBrand).toBeTypeOf("function");
  });
});
