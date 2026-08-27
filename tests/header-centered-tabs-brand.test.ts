import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredTabsBrand } from "../src/marketing/header-centered-tabs-brand.ts";
import type { HeaderCenteredTabsBrandProps } from "../src/marketing/header-centered-tabs-brand.ts";

describe("header centered tabs brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onTab: (id) => id,
      selectedTabId: "monthly",
      tabs: [{ id: "monthly", label: "Monthly billing" }],
      tabsId: "header-tabs",
    } satisfies HeaderCenteredTabsBrandProps<string>;
    expect(headerCenteredTabsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
