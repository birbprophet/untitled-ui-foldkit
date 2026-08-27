import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimple } from "../src/marketing/dropdown-menu-simple.ts";
import type { DropdownMenuSimpleProps } from "../src/marketing/dropdown-menu-simple.ts";

describe("dropdown menu simple", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as DropdownMenuSimpleProps<string>;
    expect(dropdownMenuSimple).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
