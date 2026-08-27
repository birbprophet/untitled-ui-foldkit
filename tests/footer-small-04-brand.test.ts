import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall04Brand } from "../src/marketing/footer-small-04-brand.ts";

describe("footer small 04 brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall04Brand).toBeTypeOf("function");
  });
});
