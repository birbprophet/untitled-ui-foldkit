import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqAccordion01 } from "../src/marketing/faq-accordion-01.ts";

describe("faq-accordion-01", () => {
  it("exposes the renderer", () => {
    expect(faqAccordion01).toBeTypeOf("function");
  });
});
