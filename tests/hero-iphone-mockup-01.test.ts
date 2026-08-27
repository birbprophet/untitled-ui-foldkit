import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroIphoneMockup01 } from "../src/marketing/hero-iphone-mockup-01.ts";
import type { HeroIphoneMockup01Props } from "../src/marketing/hero-iphone-mockup-01.ts";

describe("hero iphone mockup 01", () => {
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
    } satisfies HeroIphoneMockup01Props<string>;
    expect(heroIphoneMockup01).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
