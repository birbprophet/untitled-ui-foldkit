import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge14 } from "../src/marketing/footer-large-14.ts";

describe("footer large 14", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(footerLarge14).toBeTypeOf("function");
  });
});
