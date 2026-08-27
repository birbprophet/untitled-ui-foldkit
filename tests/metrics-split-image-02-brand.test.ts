import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSplitImage02Brand } from "../src/marketing/metrics-split-image-02-brand.ts";

describe("metrics split image 02 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSplitImage02Brand).toBeTypeOf("function");
  });
});
