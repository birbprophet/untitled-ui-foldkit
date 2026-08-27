import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofPressMentions } from "../src/marketing/social-proof-press-mentions.ts";

describe("social proof press mentions", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofPressMentions).toBeTypeOf("function");
  });
});
