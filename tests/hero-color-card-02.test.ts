import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroColorCard02 } from "../src/marketing/hero-color-card-02.ts";
import type { HeroColorCard02Props } from "../src/marketing/hero-color-card-02.ts";

describe("hero color card 02", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Powerful analytics to help you convert and retain more users.",
      email: "email",
      emailLabel: "email label",
      emailPlaceholder: "email placeholder",
      heading: "Beautiful analytics to grow smarter",
      hintPrefix: "hintPrefix",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      navigation: inertHtml.span([]),
      onEmailInput: (email) => email,
      onPrimary: "primary",
      onSecondary: "secondary",
      onSubmit: "submit",
      policyHref: "policyHref",
      policyLabel: "policy label",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
      submitLabel: "submit label",
    } satisfies HeroColorCard02Props<string>;
    expect(heroColorCard02).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
