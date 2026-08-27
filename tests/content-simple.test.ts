import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentSimple } from "../src/marketing/content-simple.ts";

describe("content-simple", () => {
  it("exposes the renderer", () => {
    expect(contentSimple).toBeTypeOf("function");
  });
});
