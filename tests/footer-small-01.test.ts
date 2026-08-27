import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall01 } from "../src/marketing/footer-small-01.ts";

describe("footer small 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall01).toBeTypeOf("function");
  });
});
