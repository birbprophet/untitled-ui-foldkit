import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { metricsImageWithCards02 } from "../src/marketing/metrics-image-with-cards-02.ts";

describe("metrics image with cards 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(metricsImageWithCards02).toBeTypeOf("function");
  });
});
