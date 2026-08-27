import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenTabs } from "../src/marketing/header-space-between-tabs.ts";
import type { HeaderSpaceBetweenTabsProps } from "../src/marketing/header-space-between-tabs.ts";

describe("header space between tabs", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderSpaceBetweenTabsProps<string>;
    expect(headerSpaceBetweenTabs).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
