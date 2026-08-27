import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSimple01 } from "../src/marketing/content-section-simple-01.ts";

describe("content-section-simple-01", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSimple01).toBeTypeOf("function");
  });
});
