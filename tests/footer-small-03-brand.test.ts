import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall03Brand } from "../src/marketing/footer-small-03-brand.ts";

describe("footer small 03 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall03Brand).toBeTypeOf("function");
  });
});
