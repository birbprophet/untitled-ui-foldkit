import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge13Brand } from "../src/marketing/footer-large-13-brand.ts";

describe("footer large 13 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge13Brand).toBeTypeOf("function");
  });
});
