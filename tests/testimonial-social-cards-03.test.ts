import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards03 } from "../src/marketing/testimonial-social-cards-03.ts";

describe("testimonial social cards 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards03).toBeTypeOf("function");
  });
});
