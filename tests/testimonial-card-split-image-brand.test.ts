import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialCardSplitImageBrand } from "../src/marketing/testimonial-card-split-image-brand.ts";

describe("testimonial card split image brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialCardSplitImageBrand).toBeTypeOf("function");
  });
});
