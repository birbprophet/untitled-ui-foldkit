import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menuFloating2ColWithSidebar } from "../src/marketing/menu-floating-2-col-with-sidebar.ts";
import type { MenuFloating2ColWithSidebarProps } from "../src/marketing/menu-floating-2-col-with-sidebar.ts";

describe("menu floating 2 col with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      allTutorialsLabel: "All tutorials",
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
      onAllTutorials: "tutorials",
      onItem: (id) => `item:${id}`,
      tutorials: [
        {
          description: "See the editor end to end",
          href: "#",
          id: "tour",
          imageAlt: "Tour cover",
          imageSrc: "https://www.untitledui.com/images/tour",
          onWatch: "watch:tour",
          title: "Product tour",
          watchLabel: "Watch now",
        },
      ],
      tutorialsTitle: "Video tutorials",
    } satisfies MenuFloating2ColWithSidebarProps<string>;
    expect(menuFloating2ColWithSidebar).toBeTypeOf("function");
    expect(props.onItem("abc")).toBe("item:abc");
  });
});
