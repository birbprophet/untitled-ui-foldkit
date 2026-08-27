import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialCardSplitImage } from "../src/marketing/testimonial-card-split-image.ts";

describe("testimonial card split image", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialCardSplitImage).toBeTypeOf("function");
  });
});
