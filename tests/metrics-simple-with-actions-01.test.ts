import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleWithActions01 } from "../src/marketing/metrics-simple-with-actions-01.ts";

describe("metrics simple with actions 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleWithActions01).toBeTypeOf("function");
  });
});
