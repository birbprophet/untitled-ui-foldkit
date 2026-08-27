import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered02Brand } from "../src/marketing/testimonial-simple-centered-02-brand.ts";

describe("testimonial simple centered 02 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered02Brand).toBeTypeOf("function");
  });
});
