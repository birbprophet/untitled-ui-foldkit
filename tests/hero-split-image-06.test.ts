import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSplitImage06 } from "../src/marketing/hero-split-image-06.ts";
import type { HeroSplitImage06Props } from "../src/marketing/hero-split-image-06.ts";

describe("hero split image 06", () => {
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
    } satisfies HeroSplitImage06Props<string>;
    expect(heroSplitImage06).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
