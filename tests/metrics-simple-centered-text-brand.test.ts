import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleCenteredTextBrand } from "../src/marketing/metrics-simple-centered-text-brand.ts";

describe("metrics simple centered text brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleCenteredTextBrand).toBeTypeOf("function");
  });
});
