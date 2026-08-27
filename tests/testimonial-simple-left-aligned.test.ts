import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleLeftAligned } from "../src/marketing/testimonial-simple-left-aligned.ts";

describe("testimonial simple left aligned", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleLeftAligned).toBeTypeOf("function");
  });
});
