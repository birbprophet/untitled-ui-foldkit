import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSplitImage03 } from "../src/marketing/testimonial-split-image-03.ts";

describe("testimonial split image 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSplitImage03).toBeTypeOf("function");
  });
});
