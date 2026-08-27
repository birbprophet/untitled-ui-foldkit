import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialCaseStudyCards } from "../src/marketing/testimonial-case-study-cards.ts";

describe("testimonial case study cards", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialCaseStudyCards).toBeTypeOf("function");
  });
});
