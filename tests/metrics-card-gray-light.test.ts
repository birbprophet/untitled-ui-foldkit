import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsCardGrayLight } from "../src/marketing/metrics-card-gray-light.ts";

describe("metrics card gray light", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsCardGrayLight).toBeTypeOf("function");
  });
});
