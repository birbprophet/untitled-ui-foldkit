import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimpleTwoColumnsWithFooter } from "../src/marketing/dropdown-menu-simple-two-columns-with-footer.ts";

describe("dropdown menu simple two columns with footer", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(dropdownMenuSimpleTwoColumnsWithFooter).toBeTypeOf("function");
  });
});
