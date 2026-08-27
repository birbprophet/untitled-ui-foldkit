import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards02Brand } from "../src/marketing/testimonial-social-cards-02-brand.ts";

describe("testimonial social cards 02 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards02Brand).toBeTypeOf("function");
  });
});
