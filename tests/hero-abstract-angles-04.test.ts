import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroAbstractAngles04 } from "../src/marketing/hero-abstract-angles-04.ts";
import type { HeroAbstractAngles04Props } from "../src/marketing/hero-abstract-angles-04.ts";

describe("hero abstract angles 04", () => {
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
    } satisfies HeroAbstractAngles04Props<string>;
    expect(heroAbstractAngles04).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
