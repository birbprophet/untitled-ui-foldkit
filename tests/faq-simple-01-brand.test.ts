import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple01Brand } from "../src/marketing/faq-simple-01-brand.ts";

describe("faq-simple-01-brand", () => {
  it("exposes the renderer", () => {
    expect(faqSimple01Brand).toBeTypeOf("function");
  });
});
