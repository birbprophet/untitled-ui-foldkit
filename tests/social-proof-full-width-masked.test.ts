import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidthMasked } from "../src/marketing/social-proof-full-width-masked.ts";

describe("social proof full width masked", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidthMasked).toBeTypeOf("function");
  });
});
