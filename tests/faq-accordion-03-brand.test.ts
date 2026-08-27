import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion03Brand } from "../src/marketing/faq-accordion-03-brand.ts";

describe("faq-accordion-03-brand", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion03Brand).toBeTypeOf("function");
  });
});
