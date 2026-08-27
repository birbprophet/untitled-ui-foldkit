import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards03Brand } from "../src/marketing/testimonial-social-cards-03-brand.ts";

describe("testimonial social cards 03 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards03Brand).toBeTypeOf("function");
  });
});
