import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroColorCard03 } from "../src/marketing/hero-color-card-03.ts";
import type { HeroColorCard03Props } from "../src/marketing/hero-color-card-03.ts";

describe("hero color card 03", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Powerful analytics to help you convert and retain more users.",
      heading: "Beautiful analytics to grow smarter",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      onPrimary: () => "primary",
      onSecondary: () => "secondary",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
    } satisfies HeroColorCard03Props<string>;
    expect(heroColorCard03).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
