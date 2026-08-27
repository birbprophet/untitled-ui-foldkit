import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSimple04 } from "../src/marketing/content-section-simple-04.ts";

describe("content-section-simple-04", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSimple04).toBeTypeOf("function");
  });
});
