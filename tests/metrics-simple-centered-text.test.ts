import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsSimpleCenteredText } from "../src/marketing/metrics-simple-centered-text.ts";

describe("metrics simple centered text", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsSimpleCenteredText).toBeTypeOf("function");
  });
});
