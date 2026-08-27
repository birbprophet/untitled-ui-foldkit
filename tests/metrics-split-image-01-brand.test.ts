import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSplitImage01Brand } from "../src/marketing/metrics-split-image-01-brand.ts";

describe("metrics split image 01 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSplitImage01Brand).toBeTypeOf("function");
  });
});
