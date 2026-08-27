import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentLargeImage04 } from "../src/marketing/content-large-image-04.ts";

describe("content-large-image-04", () => {
  it("exposes the renderer", () => {
    expect(contentLargeImage04).toBeTypeOf("function");
  });
});
