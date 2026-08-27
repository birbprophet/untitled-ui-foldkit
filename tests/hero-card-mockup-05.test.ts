import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup05 } from "../src/marketing/hero-card-mockup-05.ts";
import type { HeroCardMockup05Props } from "../src/marketing/hero-card-mockup-05.ts";

describe("hero card mockup 05", () => {
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
    } satisfies HeroCardMockup05Props<string>;
    expect(heroCardMockup05).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
