import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu4ColWithFooter } from "../src/marketing/menu-4-col-with-footer.ts";
import type { Menu4ColWithFooterProps } from "../src/marketing/menu-4-col-with-footer.ts";

describe("menu 4 col with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      actions: [{ href: "#", id: "support", label: "Talk to support" }],
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
      ctaLabel: "Start free trial",
      onAction: (id) => `action:${id}`,
      onCta: "cta",
      onItem: (id) => `item:${id}`,
      prompt: "Questions? We are here to help.",
    } satisfies Menu4ColWithFooterProps<string>;
    expect(menu4ColWithFooter).toBeTypeOf("function");
    expect(props.onAction("abc")).toBe("action:abc");
  });
});
