import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLogos02Brand } from "../src/marketing/cta-simple-logos-02-brand.ts";

describe("cta simple logos 02 brand", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLogos02Brand).toBeTypeOf("function");
  });
});
