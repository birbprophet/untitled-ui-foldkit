import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { pricingSimpleCallOut } from "../src/marketing/pricing-simple-call-out.ts";

describe("pricing simple call out", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(pricingSimpleCallOut).toBeTypeOf("function");
  });
});
