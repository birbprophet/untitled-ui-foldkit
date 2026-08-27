import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleWithActions02 } from "../src/marketing/metrics-simple-with-actions-02.ts";

describe("metrics simple with actions 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleWithActions02).toBeTypeOf("function");
  });
});
