import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidthMaskedBrand } from "../src/marketing/social-proof-full-width-masked-brand.ts";

describe("social proof full width masked brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidthMaskedBrand).toBeTypeOf("function");
  });
});
