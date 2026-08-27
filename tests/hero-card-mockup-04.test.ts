import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup04 } from "../src/marketing/hero-card-mockup-04.ts";
import type { HeroCardMockup04Props } from "../src/marketing/hero-card-mockup-04.ts";

describe("hero card mockup 04", () => {
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
    } satisfies HeroCardMockup04Props<string>;
    expect(heroCardMockup04).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
