import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImage02 } from "../src/marketing/cta-split-image-02.ts";

describe("cta split image 02", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImage02).toBeTypeOf("function");
  });
});
