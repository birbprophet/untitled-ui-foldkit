import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSplitImage01 } from "../src/marketing/content-section-split-image-01.ts";

describe("content-section-split-image-01", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSplitImage01).toBeTypeOf("function");
  });
});
