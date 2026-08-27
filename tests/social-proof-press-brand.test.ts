import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { socialProofPressBrand } from "../src/marketing/social-proof-press-brand.ts";

describe("social proof press brand", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(socialProofPressBrand).toBeTypeOf("function");
  });
});
