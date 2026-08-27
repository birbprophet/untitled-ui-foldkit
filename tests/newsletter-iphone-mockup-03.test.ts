import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterIphoneMockup03 } from "../src/marketing/newsletter-iphone-mockup-03.ts";

describe("newsletter iphone mockup 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterIphoneMockup03).toBeTypeOf("function");
  });
});
