import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLogos02 } from "../src/marketing/cta-simple-logos-02.ts";

describe("cta simple logos 02", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLogos02).toBeTypeOf("function");
  });
});
