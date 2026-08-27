import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { faqSimple04 } from "../src/marketing/faq-simple-04.ts";

describe("faq-simple-04", () => {
  it("exposes the renderer", () => {
    expect(faqSimple04).toBeTypeOf("function");
  });
});
