import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSplitImage01 } from "../src/marketing/content-split-image-01.ts";

describe("content-split-image-01", () => {
  it("exposes the renderer", () => {
    expect(contentSplitImage01).toBeTypeOf("function");
  });
});
