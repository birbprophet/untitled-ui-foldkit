import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple03 } from "../src/marketing/faq-simple-03.ts";

describe("faq-simple-03", () => {
  it("exposes the renderer", () => {
    expect(faqSimple03).toBeTypeOf("function");
  });
});
