import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleLeftAlignedBrand } from "../src/marketing/testimonial-simple-left-aligned-brand.ts";

describe("testimonial simple left aligned brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleLeftAlignedBrand).toBeTypeOf("function");
  });
});
