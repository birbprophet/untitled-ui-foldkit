import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterScreenMockup01 } from "../src/marketing/newsletter-screen-mockup-01.ts";

describe("newsletter screen mockup 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterScreenMockup01).toBeTypeOf("function");
  });
});
