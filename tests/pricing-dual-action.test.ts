import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingDualAction } from "../src/marketing/pricing-dual-action.ts";

describe("pricing dual action", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingDualAction).toBeTypeOf("function");
  });
});
