import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerSpaceBetweenEmailBrand } from "../src/marketing/header-space-between-email-brand.ts";
import type { HeaderSpaceBetweenEmailBrandProps } from "../src/marketing/header-space-between-email-brand.ts";

describe("header space between email brand", () => {
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
    } satisfies HeaderSpaceBetweenEmailBrandProps<string>;
    expect(headerSpaceBetweenEmailBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
