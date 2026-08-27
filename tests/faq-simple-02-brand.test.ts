import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple02Brand } from "../src/marketing/faq-simple-02-brand.ts";

describe("faq-simple-02-brand", () => {
  it("exposes the renderer", () => {
    expect(faqSimple02Brand).toBeTypeOf("function");
  });
});
