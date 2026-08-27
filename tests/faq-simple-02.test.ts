import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple02 } from "../src/marketing/faq-simple-02.ts";

describe("faq-simple-02", () => {
  it("exposes the renderer", () => {
    expect(faqSimple02).toBeTypeOf("function");
  });
});
