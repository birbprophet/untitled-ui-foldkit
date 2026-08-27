import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge16 } from "../src/marketing/footer-large-16.ts";

describe("footer large 16", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge16).toBeTypeOf("function");
  });
});
