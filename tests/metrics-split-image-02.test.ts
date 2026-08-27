import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSplitImage02 } from "../src/marketing/metrics-split-image-02.ts";

describe("metrics split image 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSplitImage02).toBeTypeOf("function");
  });
});
