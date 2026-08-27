import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentAlternative01 } from "../src/marketing/content-alternative-01.ts";

describe("content-alternative-01", () => {
  it("exposes the renderer", () => {
    expect(contentAlternative01).toBeTypeOf("function");
  });
});
