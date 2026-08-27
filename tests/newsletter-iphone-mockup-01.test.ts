import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterIphoneMockup01 } from "../src/marketing/newsletter-iphone-mockup-01.ts";

describe("newsletter iphone mockup 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterIphoneMockup01).toBeTypeOf("function");
  });
});
