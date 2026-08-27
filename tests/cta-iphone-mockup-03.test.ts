import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaIphoneMockup03 } from "../src/marketing/cta-iphone-mockup-03.ts";

describe("cta-iphone-mockup-03", () => {
  it("exposes the renderer", () => {
    expect(ctaIphoneMockup03).toBeTypeOf("function");
  });
});
