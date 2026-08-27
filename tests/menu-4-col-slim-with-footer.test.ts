import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu4ColSlimWithFooter } from "../src/marketing/menu-4-col-slim-with-footer.ts";
import type { Menu4ColSlimWithFooterProps } from "../src/marketing/menu-4-col-slim-with-footer.ts";

describe("menu 4 col slim with footer", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      actions: [{ href: "#", id: "docs", label: "Read the docs" }],
      ctaLabel: "Contact sales",
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
      onAction: (id) => `action:${id}`,
      onCta: "cta",
      onItem: (id) => `item:${id}`,
      prompt: "Need help picking a plan?",
    } satisfies Menu4ColSlimWithFooterProps<string>;
    expect(menu4ColSlimWithFooter).toBeTypeOf("function");
    expect(props.onAction("abc")).toBe("action:abc");
  });
});
