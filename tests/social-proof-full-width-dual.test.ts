import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidthDual } from "../src/marketing/social-proof-full-width-dual.ts";

describe("social proof full width dual", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidthDual).toBeTypeOf("function");
  });
});
