import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered03Brand } from "../src/marketing/testimonial-simple-centered-03-brand.ts";

describe("testimonial simple centered 03 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered03Brand).toBeTypeOf("function");
  });
});
