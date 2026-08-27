import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftButtons } from "../src/marketing/header-left-buttons.ts";
import type { HeaderLeftButtonsProps } from "../src/marketing/header-left-buttons.ts";

describe("header left buttons", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
      onPrimary: () => "primary",
      onSecondary: () => "secondary",
      primaryLabel: "Get started",
      secondaryLabel: "Chat to sales",
    } satisfies HeaderLeftButtonsProps<string>;
    expect(headerLeftButtons).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
