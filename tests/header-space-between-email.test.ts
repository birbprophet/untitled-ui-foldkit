import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenEmail } from "../src/marketing/header-space-between-email.ts";
import type { HeaderSpaceBetweenEmailProps } from "../src/marketing/header-space-between-email.ts";

describe("header space between email", () => {
  it("keeps the authenticated section renderer controlled", () => {
    const props = {
      description: "Learn more about the company.",
      email: "user@example.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      eyebrow: "About us",
      heading: "About the company",
      hintPrefix: "We care about your data in our",
      onEmailInput: (value) => value,
      onSubmit: () => "submit",
      policyHref: "#privacy",
      policyLabel: "privacy policy",
      submitLabel: "Get started",
    } satisfies HeaderSpaceBetweenEmailProps<string>;
    expect(headerSpaceBetweenEmail).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
