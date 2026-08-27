import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentAlternative03 } from "../src/marketing/content-alternative-03.ts";

describe("content-alternative-03", () => {
  it("exposes the renderer", () => {
    expect(contentAlternative03).toBeTypeOf("function");
  });
});
