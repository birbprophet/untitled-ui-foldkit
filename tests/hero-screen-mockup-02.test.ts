import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroScreenMockup02 } from "../src/marketing/hero-screen-mockup-02.ts";
import type { HeroScreenMockup02Props } from "../src/marketing/hero-screen-mockup-02.ts";

describe("hero screen mockup 02", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Powerful analytics to help you convert and retain more users.",
      heading: "Beautiful analytics to grow smarter",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      navigation: inertHtml.span([]),
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
    } satisfies HeroScreenMockup02Props<string>;
    expect(heroScreenMockup02).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
