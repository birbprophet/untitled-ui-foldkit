import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsMinimalCenteredText } from "../src/marketing/metrics-minimal-centered-text.ts";

describe("metrics minimal centered text", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsMinimalCenteredText).toBeTypeOf("function");
  });
});
