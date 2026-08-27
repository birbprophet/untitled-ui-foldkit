import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImageQuote04 } from "../src/marketing/cta-split-image-quote-04.ts";

describe("cta split image quote 04", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImageQuote04).toBeTypeOf("function");
  });
});
