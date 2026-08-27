import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion02Brand } from "../src/marketing/faq-accordion-02-brand.ts";

describe("faq-accordion-02-brand", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion02Brand).toBeTypeOf("function");
  });
});
