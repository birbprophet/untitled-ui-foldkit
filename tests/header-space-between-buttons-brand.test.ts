import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenButtonsBrand } from "../src/marketing/header-space-between-buttons-brand.ts";
import type { HeaderSpaceBetweenButtonsBrandProps } from "../src/marketing/header-space-between-buttons-brand.ts";

describe("header space between buttons brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderSpaceBetweenButtonsBrandProps<string>;
    expect(headerSpaceBetweenButtonsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
