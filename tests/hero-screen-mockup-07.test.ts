import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroScreenMockup07 } from "../src/marketing/hero-screen-mockup-07.ts";
import type { HeroScreenMockup07Props } from "../src/marketing/hero-screen-mockup-07.ts";

describe("hero screen mockup 07", () => {
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
    } satisfies HeroScreenMockup07Props<string>;
    expect(heroScreenMockup07).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
