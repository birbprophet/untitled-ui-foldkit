import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsMinimalCenteredTextBrand } from "../src/marketing/metrics-minimal-centered-text-brand.ts";

describe("metrics minimal centered text brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsMinimalCenteredTextBrand).toBeTypeOf("function");
  });
});
