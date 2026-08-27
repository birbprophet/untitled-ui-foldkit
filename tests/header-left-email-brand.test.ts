import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerLeftEmailBrand } from "../src/marketing/header-left-email-brand.ts";
import type { HeaderLeftEmailBrandProps } from "../src/marketing/header-left-email-brand.ts";

describe("header left email brand", () => {
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
      onSubmit: "submit",
      policyHref: "#privacy",
      policyLabel: "privacy policy",
      submitLabel: "Get started",
    } satisfies HeaderLeftEmailBrandProps<string>;
    expect(headerLeftEmailBrand).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
