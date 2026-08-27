import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofCardBrand } from "../src/marketing/social-proof-card-brand.ts";

describe("social proof card brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofCardBrand).toBeTypeOf("function");
  });
});
