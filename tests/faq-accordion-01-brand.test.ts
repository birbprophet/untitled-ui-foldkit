import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion01Brand } from "../src/marketing/faq-accordion-01-brand.ts";

describe("faq-accordion-01-brand", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion01Brand).toBeTypeOf("function");
  });
});
