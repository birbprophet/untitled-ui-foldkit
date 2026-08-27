import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSplitImage02 } from "../src/marketing/testimonial-split-image-02.ts";

describe("testimonial split image 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSplitImage02).toBeTypeOf("function");
  });
});
