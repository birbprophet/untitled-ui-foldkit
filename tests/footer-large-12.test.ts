import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge12 } from "../src/marketing/footer-large-12.ts";

describe("footer large 12", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge12).toBeTypeOf("function");
  });
});
