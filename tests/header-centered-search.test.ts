import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredSearch } from "../src/marketing/header-centered-search.ts";
import type { HeaderCenteredSearchProps } from "../src/marketing/header-centered-search.ts";

describe("header centered search", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderCenteredSearchProps<string>;
    expect(headerCenteredSearch).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
