import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion04Brand } from "../src/marketing/faq-accordion-04-brand.ts";

describe("faq-accordion-04-brand", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion04Brand).toBeTypeOf("function");
  });
});
