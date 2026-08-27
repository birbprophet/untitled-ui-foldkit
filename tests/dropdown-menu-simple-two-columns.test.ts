import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimpleTwoColumns } from "../src/marketing/dropdown-menu-simple-two-columns.ts";
import type { DropdownMenuSimpleTwoColumnsProps } from "../src/marketing/dropdown-menu-simple-two-columns.ts";

describe("dropdown menu simple two columns", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      items: [
        {
          badgeLabel: "New",
          href: "#",
          iconPath: "M6 6h18v18H6z",
          id: "integrations",
          subtitle: "Connect the tools you already use",
          title: "Integrations",
        },
      ],
      onItem: (id) => `item:${id}`,
    } satisfies DropdownMenuSimpleTwoColumnsProps<string>;
    expect(dropdownMenuSimpleTwoColumns).toBeTypeOf("function");
    expect(props.onItem("abc")).toBe("item:abc");
  });
});
