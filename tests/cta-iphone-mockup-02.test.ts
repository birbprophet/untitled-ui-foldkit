import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaIphoneMockup02 } from "../src/marketing/cta-iphone-mockup-02.ts";

describe("cta-iphone-mockup-02", () => {
  it("exposes the renderer", () => {
    expect(ctaIphoneMockup02).toBeTypeOf("function");
  });
});
