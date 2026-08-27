import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofCards } from "../src/marketing/social-proof-cards.ts";

describe("social proof cards", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofCards).toBeTypeOf("function");
  });
});
