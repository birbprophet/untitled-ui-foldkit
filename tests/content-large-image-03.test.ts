import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentLargeImage03 } from "../src/marketing/content-large-image-03.ts";

describe("content-large-image-03", () => {
  it("exposes the renderer", () => {
    expect(contentLargeImage03).toBeTypeOf("function");
  });
});
