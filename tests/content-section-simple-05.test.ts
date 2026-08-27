import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSectionSimple05 } from "../src/marketing/content-section-simple-05.ts";

describe("content-section-simple-05", () => {
  it("exposes the renderer", () => {
    expect(contentSectionSimple05).toBeTypeOf("function");
  });
});
