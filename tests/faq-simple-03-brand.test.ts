import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple03Brand } from "../src/marketing/faq-simple-03-brand.ts";

describe("faq-simple-03-brand", () => {
  it("exposes the renderer", () => {
    expect(faqSimple03Brand).toBeTypeOf("function");
  });
});
