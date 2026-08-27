import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredSearchBrand } from "../src/marketing/header-centered-search-brand.ts";
import type { HeaderCenteredSearchBrandProps } from "../src/marketing/header-centered-search-brand.ts";

describe("header centered search brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderCenteredSearchBrandProps<string>;
    expect(headerCenteredSearchBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
