import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsCardBrandDark } from "../src/marketing/metrics-card-brand-dark.ts";

describe("metrics card brand dark", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsCardBrandDark).toBeTypeOf("function");
  });
});
