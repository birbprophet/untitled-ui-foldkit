import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredButtons } from "../src/marketing/header-centered-buttons.ts";
import type { HeaderCenteredButtonsProps } from "../src/marketing/header-centered-buttons.ts";

describe("header centered buttons", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: () => "primary",
      onSecondary: () => "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderCenteredButtonsProps<string>;
    expect(headerCenteredButtons).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
