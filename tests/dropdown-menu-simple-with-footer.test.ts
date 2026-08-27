import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuSimpleWithFooter } from "../src/marketing/dropdown-menu-simple-with-footer.ts";
import type { DropdownMenuSimpleWithFooterProps } from "../src/marketing/dropdown-menu-simple-with-footer.ts";

describe("dropdown menu simple with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      allResourcesLabel: "All resources",
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
      onAllResources: "resources",
      onItem: (id) => `item:${id}`,
    } satisfies DropdownMenuSimpleWithFooterProps<string>;
    expect(dropdownMenuSimpleWithFooter).toBeTypeOf("function");
    expect(props.onItem("abc")).toBe("item:abc");
  });
});
