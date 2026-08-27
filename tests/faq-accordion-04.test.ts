import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion04 } from "../src/marketing/faq-accordion-04.ts";

describe("faq-accordion-04", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion04).toBeTypeOf("function");
  });
});
