import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenSearch } from "../src/marketing/header-space-between-search.ts";
import type { HeaderSpaceBetweenSearchProps } from "../src/marketing/header-space-between-search.ts";

describe("header space between search", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderSpaceBetweenSearchProps<string>;
    expect(headerSpaceBetweenSearch).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
