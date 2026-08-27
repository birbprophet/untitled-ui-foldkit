import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialAbstractImage } from "../src/marketing/testimonial-abstract-image.ts";

describe("testimonial abstract image", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialAbstractImage).toBeTypeOf("function");
  });
});
