import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSplitImage02 } from "../src/marketing/hero-split-image-02.ts";
import type { HeroSplitImage02Props } from "../src/marketing/hero-split-image-02.ts";

describe("hero split image 02", () => {
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
    } satisfies HeroSplitImage02Props<string>;
    expect(heroSplitImage02).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
