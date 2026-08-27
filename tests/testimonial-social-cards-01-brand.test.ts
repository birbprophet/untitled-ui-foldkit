import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialSocialCards01Brand } from "../src/marketing/testimonial-social-cards-01-brand.ts";

describe("testimonial social cards 01 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialSocialCards01Brand).toBeTypeOf("function");
  });
});
