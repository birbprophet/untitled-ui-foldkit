import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentLargeImage02 } from "../src/marketing/content-large-image-02.ts";

describe("content-large-image-02", () => {
  it("exposes the renderer", () => {
    expect(contentLargeImage02).toBeTypeOf("function");
  });
});
