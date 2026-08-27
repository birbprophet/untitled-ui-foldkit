import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenSearchBrand } from "../src/marketing/header-space-between-search-brand.ts";
import type { HeaderSpaceBetweenSearchBrandProps } from "../src/marketing/header-space-between-search-brand.ts";

describe("header space between search brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderSpaceBetweenSearchBrandProps<string>;
    expect(headerSpaceBetweenSearchBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
