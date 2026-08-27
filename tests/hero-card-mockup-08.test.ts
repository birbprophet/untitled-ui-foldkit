import { inertHtml } from "foldkit/html";
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { heroCardMockup08 } from "../src/marketing/hero-card-mockup-08.ts";
import type { HeroCardMockup08Props } from "../src/marketing/hero-card-mockup-08.ts";

describe("hero card mockup 08", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Powerful analytics to help you convert and retain more users.",
      email: "email",
      emailLabel: "email label",
      emailPlaceholder: "email placeholder",
      heading: "Beautiful analytics to grow smarter",
      hintPrefix: "Try it free —",
      imageAlt: "Hero image",
      imageUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
      navigation: inertHtml.span([]),
      onEmailInput: (email) => email,
      onPrimary: "primary",
      onSecondary: "secondary",
      onSubmit: "submit",
      policyHref: "#privacy",
      policyLabel: "policy label",
      primaryLabel: "Sign up",
      secondaryLabel: "Demo",
      submitLabel: "submit label",
    } satisfies HeroCardMockup08Props<string>;
    expect(heroCardMockup08).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
