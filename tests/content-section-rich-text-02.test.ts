import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionRichText02 } from "../src/marketing/content-section-rich-text-02.ts";

describe("content-section-rich-text-02", () => {
  it("exposes the renderer", () => {
    expect(contentSectionRichText02).toBeTypeOf("function");
  });
});
