import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSimpleText01 } from "../src/marketing/hero-simple-text-01.ts";
import type { HeroSimpleText01Props } from "../src/marketing/hero-simple-text-01.ts";

describe("hero simple text 01", () => {
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
    } satisfies HeroSimpleText01Props<string>;
    expect(heroSimpleText01).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
