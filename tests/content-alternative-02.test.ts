import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contentAlternative02 } from "../src/marketing/content-alternative-02.ts";

describe("content-alternative-02", () => {
  it("exposes the renderer", () => {
    expect(contentAlternative02).toBeTypeOf("function");
  });
});
