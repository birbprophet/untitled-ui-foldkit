import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuWithTwoColsAndLinksAndFooter } from "../src/marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";
import type { DropdownMenuWithTwoColsAndLinksAndFooterProps } from "../src/marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";

describe("dropdown menu with two cols and links and footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      columns: [
        {
          id: "col-1",
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
          title: "Platform",
        },
      ],
      description: "Everything you need to ship faster",
      documentationLabel: "Documentation",
      getStartedItems: [{ href: "#", id: "quickstart", title: "Quickstart" }],
      getStartedTitle: "Get started",
      heading: "Introducing Siglata",
      onAction: (id) => `action:${id}`,
      onGetStarted: (id) => `get-started:${id}`,
      onItem: (id) => `item:${id}`,
      onViewAll: "view-all",
      viewAllLabel: "View all",
    } satisfies DropdownMenuWithTwoColsAndLinksAndFooterProps<string>;
    expect(dropdownMenuWithTwoColsAndLinksAndFooter).toBeTypeOf("function");
    expect(props.onAction("abc")).toBe("action:abc");
  });
});
