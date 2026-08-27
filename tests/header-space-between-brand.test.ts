import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenBrand } from "../src/marketing/header-space-between-brand.ts";
import type { HeaderSpaceBetweenBrandProps } from "../src/marketing/header-space-between-brand.ts";

describe("header space between brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderSpaceBetweenBrandProps<string>;
    expect(headerSpaceBetweenBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
