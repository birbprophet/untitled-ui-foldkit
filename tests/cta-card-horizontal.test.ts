import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaCardHorizontal } from "../src/marketing/cta-card-horizontal.ts";

describe("cta-card-horizontal", () => {
  it("exposes the renderer", () => {
    expect(ctaCardHorizontal).toBeTypeOf("function");
  });
});
