import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaScreenMockup03 } from "../src/marketing/cta-screen-mockup-03.ts";

describe("cta-screen-mockup-03", () => {
  it("exposes the renderer", () => {
    expect(ctaScreenMockup03).toBeTypeOf("function");
  });
});
