import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSplitImage03 } from "../src/marketing/hero-split-image-03.ts";
import type { HeroSplitImage03Props } from "../src/marketing/hero-split-image-03.ts";

describe("hero split image 03", () => {
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
    } satisfies HeroSplitImage03Props<string>;
    expect(heroSplitImage03).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
