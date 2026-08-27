import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered01Brand } from "../src/marketing/testimonial-simple-centered-01-brand.ts";

describe("testimonial simple centered 01 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered01Brand).toBeTypeOf("function");
  });
});
