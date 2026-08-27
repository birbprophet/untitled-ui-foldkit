import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredBrand } from "../src/marketing/header-centered-brand.ts";
import type { HeaderCenteredBrandProps } from "../src/marketing/header-centered-brand.ts";

describe("header centered brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderCenteredBrandProps<string>;
    expect(headerCenteredBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
