import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards02 } from "../src/marketing/testimonial-social-cards-02.ts";

describe("testimonial social cards 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards02).toBeTypeOf("function");
  });
});
