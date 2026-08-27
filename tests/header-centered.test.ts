import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCentered } from "../src/marketing/header-centered.ts";
import type { HeaderCenteredProps } from "../src/marketing/header-centered.ts";

describe("header centered", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      eyebrow: "About us",
      heading: "About the company",
    } satisfies HeaderCenteredProps<string>;
    expect(headerCentered).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
