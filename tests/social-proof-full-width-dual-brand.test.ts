import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidthDualBrand } from "../src/marketing/social-proof-full-width-dual-brand.ts";

describe("social proof full width dual brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidthDualBrand).toBeTypeOf("function");
  });
});
