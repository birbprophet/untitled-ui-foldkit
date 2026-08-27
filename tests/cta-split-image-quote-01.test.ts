import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImageQuote01 } from "../src/marketing/cta-split-image-quote-01.ts";

describe("cta split image quote 01", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImageQuote01).toBeTypeOf("function");
  });
});
