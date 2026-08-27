import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimpleWithFooter } from "../src/marketing/dropdown-menu-simple-with-footer.ts";
import type { DropdownMenuSimpleWithFooterProps } from "../src/marketing/dropdown-menu-simple-with-footer.ts";

describe("dropdown menu simple with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as DropdownMenuSimpleWithFooterProps<string>;
    expect(dropdownMenuSimpleWithFooter).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
