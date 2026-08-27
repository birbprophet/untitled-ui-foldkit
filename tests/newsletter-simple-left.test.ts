import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterSimpleLeft } from "../src/marketing/newsletter-simple-left.ts";

describe("newsletter simple left", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterSimpleLeft).toBeTypeOf("function");
  });
});
