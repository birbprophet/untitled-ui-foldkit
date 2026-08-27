import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion02 } from "../src/marketing/faq-accordion-02.ts";

describe("faq-accordion-02", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion02).toBeTypeOf("function");
  });
});
