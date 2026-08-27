import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaCardVertical } from "../src/marketing/cta-card-vertical.ts";

describe("cta-card-vertical", () => {
  it("exposes the renderer", () => {
    expect(ctaCardVertical).toBeTypeOf("function");
  });
});
