import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleAccentLine } from "../src/marketing/metrics-simple-accent-line.ts";

describe("metrics simple accent line", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleAccentLine).toBeTypeOf("function");
  });
});
