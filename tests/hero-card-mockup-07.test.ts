import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup07 } from "../src/marketing/hero-card-mockup-07.ts";
import type { HeroCardMockup07Props } from "../src/marketing/hero-card-mockup-07.ts";

describe("hero card mockup 07", () => {
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
    } satisfies HeroCardMockup07Props<string>;
    expect(heroCardMockup07).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
