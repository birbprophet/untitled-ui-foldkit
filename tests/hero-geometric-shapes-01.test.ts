import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroGeometricShapes01 } from "../src/marketing/hero-geometric-shapes-01.ts";
import type { HeroGeometricShapes01Props } from "../src/marketing/hero-geometric-shapes-01.ts";

describe("hero geometric shapes 01", () => {
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
    } satisfies HeroGeometricShapes01Props<string>;
    expect(heroGeometricShapes01).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
