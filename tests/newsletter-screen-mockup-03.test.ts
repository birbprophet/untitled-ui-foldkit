import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterScreenMockup03 } from "../src/marketing/newsletter-screen-mockup-03.ts";

describe("newsletter screen mockup 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterScreenMockup03).toBeTypeOf("function");
  });
});
