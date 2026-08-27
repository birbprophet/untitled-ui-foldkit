import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSplitImage02 } from "../src/marketing/content-split-image-02.ts";

describe("content-split-image-02", () => {
  it("exposes the renderer", () => {
    expect(contentSplitImage02).toBeTypeOf("function");
  });
});
