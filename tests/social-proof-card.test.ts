import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofCard } from "../src/marketing/social-proof-card.ts";

describe("social proof card", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofCard).toBeTypeOf("function");
  });
});
