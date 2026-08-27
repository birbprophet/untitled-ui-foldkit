import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu2ColWithLinks } from "../src/marketing/menu-2-col-with-links.ts";
import type { Menu2ColWithLinksProps } from "../src/marketing/menu-2-col-with-links.ts";

describe("menu 2 col with links", () => {
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
      getStartedItems: [{ href: "#", id: "quickstart", title: "Quickstart" }],
      getStartedTitle: "Get started",
      onGetStarted: (id) => `get-started:${id}`,
      onItem: (id) => `item:${id}`,
    } satisfies Menu2ColWithLinksProps<string>;
    expect(menu2ColWithLinks).toBeTypeOf("function");
    expect(props.onGetStarted("abc")).toBe("get-started:abc");
  });
});
