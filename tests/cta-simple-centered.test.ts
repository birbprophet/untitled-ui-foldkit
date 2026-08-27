import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { ctaSimpleCentered } from "../src/marketing/cta-simple-centered.ts";

describe("cta simple centered", () => {
  it("exposes the renderer", () => {
    expect(ctaSimpleCentered).toBeTypeOf("function");
  });
});
