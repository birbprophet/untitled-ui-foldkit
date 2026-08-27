import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerSmall04 } from "../src/marketing/footer-small-04.ts";

describe("footer small 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerSmall04).toBeTypeOf("function");
  });
});
