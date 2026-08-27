import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSplitImage01 } from "../src/marketing/testimonial-split-image-01.ts";

describe("testimonial split image 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSplitImage01).toBeTypeOf("function");
  });
});
