import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImage03 } from "../src/marketing/cta-split-image-03.ts";

describe("cta split image 03", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImage03).toBeTypeOf("function");
  });
});
