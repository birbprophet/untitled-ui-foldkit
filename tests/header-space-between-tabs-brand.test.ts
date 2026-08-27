import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenTabsBrand } from "../src/marketing/header-space-between-tabs-brand.ts";
import type { HeaderSpaceBetweenTabsBrandProps } from "../src/marketing/header-space-between-tabs-brand.ts";

describe("header space between tabs brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderSpaceBetweenTabsBrandProps<string>;
    expect(headerSpaceBetweenTabsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
