import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaScreenMockup01 } from "../src/marketing/cta-screen-mockup-01.ts";

describe("cta-screen-mockup-01", () => {
  it("exposes the renderer", () => {
    expect(ctaScreenMockup01).toBeTypeOf("function");
  });
});
