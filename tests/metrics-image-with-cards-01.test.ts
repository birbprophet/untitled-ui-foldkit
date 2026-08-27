import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsImageWithCards01 } from "../src/marketing/metrics-image-with-cards-01.ts";

describe("metrics image with cards 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsImageWithCards01).toBeTypeOf("function");
  });
});
