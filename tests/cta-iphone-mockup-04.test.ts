import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaIphoneMockup04 } from "../src/marketing/cta-iphone-mockup-04.ts";

describe("cta-iphone-mockup-04", () => {
  it("exposes the renderer", () => {
    expect(ctaIphoneMockup04).toBeTypeOf("function");
  });
});
