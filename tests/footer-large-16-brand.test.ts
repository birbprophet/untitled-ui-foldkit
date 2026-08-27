import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge16Brand } from "../src/marketing/footer-large-16-brand.ts";

describe("footer large 16 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge16Brand).toBeTypeOf("function");
  });
});
