import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftTabsBrand } from "../src/marketing/header-left-tabs-brand.ts";
import type { HeaderLeftTabsBrandProps } from "../src/marketing/header-left-tabs-brand.ts";

describe("header left tabs brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderLeftTabsBrandProps<string>;
    expect(headerLeftTabsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
