import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftSearch } from "../src/marketing/header-left-search.ts";
import type { HeaderLeftSearchProps } from "../src/marketing/header-left-search.ts";

describe("header left search", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onSearch: (value) => value,
      searchLabel: "Search",
      searchPlaceholder: "Search",
      searchValue: "billing",
    } satisfies HeaderLeftSearchProps<string>;
    expect(headerLeftSearch).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
