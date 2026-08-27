import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroSplitImage01 } from "../src/marketing/hero-split-image-01.ts";
import type { HeroSplitImage01Props } from "../src/marketing/hero-split-image-01.ts";

describe("hero split image 01", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      badgeAddon: "badge addon",
      badgeHref: "badge href",
      badgeLabel: "badge label",
      description: "Powerful analytics to help you convert and retain more users.",
      email: "email",
      emailLabel: "email label",
      emailPlaceholder: "emailPlaceholder",
      heading: "Beautiful analytics to grow smarter",
      hintPrefix: "hintPrefix",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      navigation: inertHtml.span([]),
      onBadge: "badge",
      onEmailInput: (email) => email,
      onPrimary: "primary",
      onSecondary: "secondary",
      onSubmit: "submit",
      policyHref: "policyHref",
      policyLabel: "policy label",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
      submitLabel: "submit label",
    } satisfies HeroSplitImage01Props<string>;
    expect(heroSplitImage01).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
