import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSplitImage04 } from "../src/marketing/content-split-image-04.ts";

describe("content-split-image-04", () => {
  it("exposes the renderer", () => {
    expect(contentSplitImage04).toBeTypeOf("function");
  });
});
