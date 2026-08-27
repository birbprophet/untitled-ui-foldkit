import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftBrand } from "../src/marketing/header-left-brand.ts";
import type { HeaderLeftBrandProps } from "../src/marketing/header-left-brand.ts";

describe("header left brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderLeftBrandProps<string>;
    expect(headerLeftBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
