import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterScreenMockup04 } from "../src/marketing/newsletter-screen-mockup-04.ts";

describe("newsletter screen mockup 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterScreenMockup04).toBeTypeOf("function");
  });
});
