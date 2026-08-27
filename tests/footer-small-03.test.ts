import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall03 } from "../src/marketing/footer-small-03.ts";

describe("footer small 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall03).toBeTypeOf("function");
  });
});
