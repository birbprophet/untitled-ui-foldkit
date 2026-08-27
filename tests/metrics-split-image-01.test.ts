import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSplitImage01 } from "../src/marketing/metrics-split-image-01.ts";

describe("metrics split image 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSplitImage01).toBeTypeOf("function");
  });
});
