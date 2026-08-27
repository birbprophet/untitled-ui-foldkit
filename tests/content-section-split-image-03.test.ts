import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSplitImage03 } from "../src/marketing/content-section-split-image-03.ts";

describe("content-section-split-image-03", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSplitImage03).toBeTypeOf("function");
  });
});
