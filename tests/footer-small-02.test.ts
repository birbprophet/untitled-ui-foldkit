import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall02 } from "../src/marketing/footer-small-02.ts";

describe("footer small 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall02).toBeTypeOf("function");
  });
});
