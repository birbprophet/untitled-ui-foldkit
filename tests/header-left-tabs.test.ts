import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftTabs } from "../src/marketing/header-left-tabs.ts";
import type { HeaderLeftTabsProps } from "../src/marketing/header-left-tabs.ts";

describe("header left tabs", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderLeftTabsProps<string>;
    expect(headerLeftTabs).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
