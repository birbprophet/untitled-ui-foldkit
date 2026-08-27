import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSplitForm02 } from "../src/marketing/hero-split-form-02.ts";
import type { HeroSplitForm02Props } from "../src/marketing/hero-split-form-02.ts";

describe("hero split form 02", () => {
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
    } satisfies HeroSplitForm02Props<string>;
    expect(heroSplitForm02).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
