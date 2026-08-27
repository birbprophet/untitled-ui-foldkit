import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSimpleCentered02 } from "../src/marketing/testimonial-simple-centered-02.ts";

describe("testimonial simple centered 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSimpleCentered02).toBeTypeOf("function");
  });
});
