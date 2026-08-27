import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion03 } from "../src/marketing/faq-accordion-03.ts";

describe("faq-accordion-03", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion03).toBeTypeOf("function");
  });
});
