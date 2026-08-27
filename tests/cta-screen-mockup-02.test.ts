import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaScreenMockup02 } from "../src/marketing/cta-screen-mockup-02.ts";

describe("cta-screen-mockup-02", () => {
  it("exposes the renderer", () => {
    expect(ctaScreenMockup02).toBeTypeOf("function");
  });
});
