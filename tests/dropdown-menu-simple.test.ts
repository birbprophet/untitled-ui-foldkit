import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimple } from "../src/marketing/dropdown-menu-simple.ts";
import type { DropdownMenuSimpleProps } from "../src/marketing/dropdown-menu-simple.ts";

describe("dropdown menu simple", () => {
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
    } satisfies DropdownMenuSimpleProps<string>;
    expect(dropdownMenuSimple).toBeTypeOf("function");
    expect(props.onItem("abc")).toBe("item:abc");
  });
});
