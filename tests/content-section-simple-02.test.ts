import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSimple02 } from "../src/marketing/content-section-simple-02.ts";

describe("content-section-simple-02", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSimple02).toBeTypeOf("function");
  });
});
