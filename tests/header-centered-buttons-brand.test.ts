import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredButtonsBrand } from "../src/marketing/header-centered-buttons-brand.ts";
import type { HeaderCenteredButtonsBrandProps } from "../src/marketing/header-centered-buttons-brand.ts";

describe("header centered buttons brand", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderCenteredButtonsBrandProps<string>;
    expect(headerCenteredButtonsBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
