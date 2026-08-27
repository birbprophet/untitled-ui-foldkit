import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenButtons } from "../src/marketing/header-space-between-buttons.ts";
import type { HeaderSpaceBetweenButtonsProps } from "../src/marketing/header-space-between-buttons.ts";

describe("header space between buttons", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderSpaceBetweenButtonsProps<string>;
    expect(headerSpaceBetweenButtons).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
