import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered01 } from "../src/marketing/testimonial-simple-centered-01.ts";

describe("testimonial simple centered 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered01).toBeTypeOf("function");
  });
});
