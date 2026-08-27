import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { testimonialCard } from "../src/marketing/testimonial-card.ts";

describe("testimonial card", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(testimonialCard).toBeTypeOf("function");
  });
});
