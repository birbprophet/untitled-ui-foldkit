import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { newsletterCardHorizontal } from "../src/marketing/newsletter-card-horizontal.ts";

describe("newsletter card horizontal", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(newsletterCardHorizontal).toBeTypeOf("function");
  });
});
