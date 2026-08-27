import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSplitImage04 } from "../src/marketing/cta-split-image-04.ts";

describe("cta split image 04", () => {
  it("exposes the renderer", () => {
    expect(ctaSplitImage04).toBeTypeOf("function");
  });
});
