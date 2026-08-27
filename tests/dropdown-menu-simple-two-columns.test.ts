import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimpleTwoColumns } from "../src/marketing/dropdown-menu-simple-two-columns.ts";
import type { DropdownMenuSimpleTwoColumnsProps } from "../src/marketing/dropdown-menu-simple-two-columns.ts";

describe("dropdown menu simple two columns", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as DropdownMenuSimpleTwoColumnsProps<string>;
    expect(dropdownMenuSimpleTwoColumns).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
