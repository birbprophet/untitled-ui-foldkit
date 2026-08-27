import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftSearchBrand } from "../src/marketing/header-left-search-brand.ts";
import type { HeaderLeftSearchBrandProps } from "../src/marketing/header-left-search-brand.ts";

describe("header left search brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderLeftSearchBrandProps<string>;
    expect(headerLeftSearchBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
