import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterIphoneMockup04 } from "../src/marketing/newsletter-iphone-mockup-04.ts";

describe("newsletter iphone mockup 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterIphoneMockup04).toBeTypeOf("function");
  });
});
