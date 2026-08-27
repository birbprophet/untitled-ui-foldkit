import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentLargeImage01 } from "../src/marketing/content-large-image-01.ts";

describe("content-large-image-01", () => {
  it("exposes the renderer", () => {
    expect(contentLargeImage01).toBeTypeOf("function");
  });
});
