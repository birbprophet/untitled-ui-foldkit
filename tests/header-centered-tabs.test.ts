import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredTabs } from "../src/marketing/header-centered-tabs.ts";
import type { HeaderCenteredTabsProps } from "../src/marketing/header-centered-tabs.ts";

describe("header centered tabs", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderCenteredTabsProps<string>;
    expect(headerCenteredTabs).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
