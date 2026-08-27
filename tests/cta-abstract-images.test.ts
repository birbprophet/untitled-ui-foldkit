import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaAbstractImages } from "../src/marketing/cta-abstract-images.ts";

describe("cta-abstract-images", () => {
  it("exposes the renderer", () => {
    expect(ctaAbstractImages).toBeTypeOf("function");
  });
});
