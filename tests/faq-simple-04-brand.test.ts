import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple04Brand } from "../src/marketing/faq-simple-04-brand.ts";

describe("faq-simple-04-brand", () => {
  it("exposes the renderer", () => {
    expect(faqSimple04Brand).toBeTypeOf("function");
  });
});
