import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterSimpleCentered } from "../src/marketing/newsletter-simple-centered.ts";

describe("newsletter simple centered", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterSimpleCentered).toBeTypeOf("function");
  });
});
