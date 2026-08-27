import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingGrayBadge } from "../src/marketing/pricing-gray-badge.ts";

describe("pricing gray badge", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingGrayBadge).toBeTypeOf("function");
  });
});
