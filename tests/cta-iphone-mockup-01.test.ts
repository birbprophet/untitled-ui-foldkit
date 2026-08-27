import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaIphoneMockup01 } from "../src/marketing/cta-iphone-mockup-01.ts";

describe("cta-iphone-mockup-01", () => {
  it("exposes the renderer", () => {
    expect(ctaIphoneMockup01).toBeTypeOf("function");
  });
});
