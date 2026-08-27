import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofCardsBrand } from "../src/marketing/social-proof-cards-brand.ts";

describe("social proof cards brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofCardsBrand).toBeTypeOf("function");
  });
});
