import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSplitImage02 } from "../src/marketing/content-section-split-image-02.ts";

describe("content-section-split-image-02", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSplitImage02).toBeTypeOf("function");
  });
});
