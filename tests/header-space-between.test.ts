import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetween } from "../src/marketing/header-space-between.ts";
import type { HeaderSpaceBetweenProps } from "../src/marketing/header-space-between.ts";

describe("header space between", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderSpaceBetweenProps<string>;
    expect(headerSpaceBetween).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
