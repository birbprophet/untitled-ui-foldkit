import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge14Brand } from "../src/marketing/footer-large-14-brand.ts";

describe("footer large 14 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge14Brand).toBeTypeOf("function");
  });
});
