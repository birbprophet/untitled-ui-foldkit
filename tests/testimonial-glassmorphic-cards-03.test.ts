import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialGlassmorphicCards03 } from "../src/marketing/testimonial-glassmorphic-cards-03.ts";

describe("testimonial glassmorphic cards 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialGlassmorphicCards03).toBeTypeOf("function");
  });
});
