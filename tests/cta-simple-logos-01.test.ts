import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLogos01 } from "../src/marketing/cta-simple-logos-01.ts";

describe("cta simple logos 01", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLogos01).toBeTypeOf("function");
  });
});
