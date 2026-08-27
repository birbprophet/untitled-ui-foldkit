import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered03 } from "../src/marketing/testimonial-simple-centered-03.ts";

describe("testimonial simple centered 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered03).toBeTypeOf("function");
  });
});
