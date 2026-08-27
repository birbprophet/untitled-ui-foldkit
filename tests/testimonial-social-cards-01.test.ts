import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards01 } from "../src/marketing/testimonial-social-cards-01.ts";

describe("testimonial social cards 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards01).toBeTypeOf("function");
  });
});
