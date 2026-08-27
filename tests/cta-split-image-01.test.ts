import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImage01 } from "../src/marketing/cta-split-image-01.ts";

describe("cta split image 01", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImage01).toBeTypeOf("function");
  });
});
