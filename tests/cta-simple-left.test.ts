import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleLeft } from "../src/marketing/cta-simple-left.ts";

describe("cta simple left", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleLeft).toBeTypeOf("function");
  });
});
