import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterIphoneMockup02 } from "../src/marketing/newsletter-iphone-mockup-02.ts";

describe("newsletter iphone mockup 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterIphoneMockup02).toBeTypeOf("function");
  });
});
