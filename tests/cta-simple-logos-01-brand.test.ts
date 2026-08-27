import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLogos01Brand } from "../src/marketing/cta-simple-logos-01-brand.ts";

describe("cta simple logos 01 brand", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLogos01Brand).toBeTypeOf("function");
  });
});
