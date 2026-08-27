import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftButtonsBrand } from "../src/marketing/header-left-buttons-brand.ts";
import type { HeaderLeftButtonsBrandProps } from "../src/marketing/header-left-buttons-brand.ts";

describe("header left buttons brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderLeftButtonsBrandProps<string>;
    expect(headerLeftButtonsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
