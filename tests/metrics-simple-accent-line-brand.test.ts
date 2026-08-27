import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleAccentLineBrand } from "../src/marketing/metrics-simple-accent-line-brand.ts";

describe("metrics simple accent line brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleAccentLineBrand).toBeTypeOf("function");
  });
});
