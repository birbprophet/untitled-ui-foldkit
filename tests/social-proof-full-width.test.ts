import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofFullWidth } from "../src/marketing/social-proof-full-width.ts";

describe("social proof full width", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofFullWidth).toBeTypeOf("function");
  });
});
