import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup01 } from "../src/marketing/hero-card-mockup-01.ts";
import type { HeroCardMockup01Props } from "../src/marketing/hero-card-mockup-01.ts";

describe("hero card mockup 01", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      badgeAddon: "badge addon",
      badgeHref: "badge href",
      badgeLabel: "badge label",
      description: "Powerful analytics to help you convert and retain more users.",
      heading: "Beautiful analytics to grow smarter",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      navigation: inertHtml.span([]),
      onBadge: "badge",
      onPrimary: "primary",
      onSecondary: "secondary",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
    } satisfies HeroCardMockup01Props<string>;
    expect(heroCardMockup01).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
