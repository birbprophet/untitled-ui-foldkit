import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall01Brand } from "../src/marketing/footer-small-01-brand.ts";

describe("footer small 01 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall01Brand).toBeTypeOf("function");
  });
});
