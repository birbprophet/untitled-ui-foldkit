import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterCardVertical } from "../src/marketing/newsletter-card-vertical.ts";

describe("newsletter card vertical", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterCardVertical).toBeTypeOf("function");
  });
});
