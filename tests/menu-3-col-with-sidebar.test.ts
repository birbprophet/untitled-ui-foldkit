import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu3ColWithSidebar } from "../src/marketing/menu-3-col-with-sidebar.ts";
import type { Menu3ColWithSidebarProps } from "../src/marketing/menu-3-col-with-sidebar.ts";

describe("menu 3 col with sidebar", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      cardDescription: "Automate busywork",
      cardDismissLabel: "Dismiss",
      cardHref: "#",
      cardImageAlt: "Changelog cover",
      cardImageSrc: "https://www.untitledui.com/images/changelog",
      cardTitle: "Meeting automations",
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
      onChangelog: "changelog",
      onDismiss: "dismiss",
      onItem: (id) => `item:${id}`,
    } satisfies Menu3ColWithSidebarProps<string>;
    expect(menu3ColWithSidebar).toBeTypeOf("function");
    expect(props.onItem("abc")).toBe("item:abc");
  });
});
