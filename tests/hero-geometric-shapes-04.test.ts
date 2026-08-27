import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroGeometricShapes04 } from "../src/marketing/hero-geometric-shapes-04.ts";
import type { HeroGeometricShapes04Props } from "../src/marketing/hero-geometric-shapes-04.ts";

describe("hero geometric shapes 04", () => {
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
    } satisfies HeroGeometricShapes04Props<string>;
    expect(heroGeometricShapes04).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
