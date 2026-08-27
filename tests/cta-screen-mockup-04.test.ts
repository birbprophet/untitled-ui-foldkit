import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaScreenMockup04 } from "../src/marketing/cta-screen-mockup-04.ts";

describe("cta-screen-mockup-04", () => {
  it("exposes the renderer", () => {
    expect(ctaScreenMockup04).toBeTypeOf("function");
  });
});
