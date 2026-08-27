import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSimple03 } from "../src/marketing/content-section-simple-03.ts";

describe("content-section-simple-03", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSimple03).toBeTypeOf("function");
  });
});
