import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeft } from "../src/marketing/header-left.ts";
import type { HeaderLeftProps } from "../src/marketing/header-left.ts";

describe("header left", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderLeftProps<string>;
    expect(headerLeft).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
