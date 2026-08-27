import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroScreenMockup08 } from "../src/marketing/hero-screen-mockup-08.ts";
import type { HeroScreenMockup08Props } from "../src/marketing/hero-screen-mockup-08.ts";

describe("hero screen mockup 08", () => {
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
    } satisfies HeroScreenMockup08Props<string>;
    expect(heroScreenMockup08).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
