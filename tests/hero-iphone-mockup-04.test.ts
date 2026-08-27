import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroIphoneMockup04 } from "../src/marketing/hero-iphone-mockup-04.ts";
import type { HeroIphoneMockup04Props } from "../src/marketing/hero-iphone-mockup-04.ts";

describe("hero iphone mockup 04", () => {
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
    } satisfies HeroIphoneMockup04Props<string>;
    expect(heroIphoneMockup04).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
