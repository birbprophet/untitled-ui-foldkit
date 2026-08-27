import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterScreenMockup02 } from "../src/marketing/newsletter-screen-mockup-02.ts";

describe("newsletter screen mockup 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterScreenMockup02).toBeTypeOf("function");
  });
});
