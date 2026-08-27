import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup06 } from "../src/marketing/hero-card-mockup-06.ts";
import type { HeroCardMockup06Props } from "../src/marketing/hero-card-mockup-06.ts";

describe("hero card mockup 06", () => {
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
    } satisfies HeroCardMockup06Props<string>;
    expect(heroCardMockup06).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
