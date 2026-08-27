import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall02Brand } from "../src/marketing/footer-small-02-brand.ts";

describe("footer small 02 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall02Brand).toBeTypeOf("function");
  });
});
