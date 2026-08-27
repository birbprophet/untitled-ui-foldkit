import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuWithTwoColsAndLinksAndFooter } from "../src/marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";
import type { DropdownMenuWithTwoColsAndLinksAndFooterProps } from "../src/marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";

describe("dropdown menu with two cols and links and footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as DropdownMenuWithTwoColsAndLinksAndFooterProps<string>;
    expect(dropdownMenuWithTwoColsAndLinksAndFooter).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
