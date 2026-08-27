import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialCardBrand } from "../src/marketing/testimonial-card-brand.ts";

describe("testimonial card brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialCardBrand).toBeTypeOf("function");
  });
});
