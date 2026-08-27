import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImageQuote03 } from "../src/marketing/cta-split-image-quote-03.ts";

describe("cta split image quote 03", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImageQuote03).toBeTypeOf("function");
  });
});
