import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidthBrand } from "../src/marketing/social-proof-full-width-brand.ts";

describe("social proof full width brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidthBrand).toBeTypeOf("function");
  });
});
