import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionRichText01 } from "../src/marketing/content-section-rich-text-01.ts";

describe("content-section-rich-text-01", () => {
  it("exposes the renderer", () => {
    expect(contentSectionRichText01).toBeTypeOf("function");
  });
});
