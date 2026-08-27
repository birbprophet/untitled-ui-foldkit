import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImageQuote02 } from "../src/marketing/cta-split-image-quote-02.ts";

describe("cta split image quote 02", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImageQuote02).toBeTypeOf("function");
  });
});
