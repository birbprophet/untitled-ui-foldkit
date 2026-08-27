import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple01 } from "../src/marketing/faq-simple-01.ts";

describe("faq-simple-01", () => {
  it("exposes the renderer", () => {
    expect(faqSimple01).toBeTypeOf("function");
  });
});
