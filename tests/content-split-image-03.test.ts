import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSplitImage03 } from "../src/marketing/content-split-image-03.ts";

describe("content-split-image-03", () => {
  it("exposes the renderer", () => {
    expect(contentSplitImage03).toBeTypeOf("function");
  });
});
