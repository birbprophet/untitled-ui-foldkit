import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialGlassmorphicCards01 } from "../src/marketing/testimonial-glassmorphic-cards-01.ts";

describe("testimonial glassmorphic cards 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialGlassmorphicCards01).toBeTypeOf("function");
  });
});
