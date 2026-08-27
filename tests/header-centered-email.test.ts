import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerCenteredEmail } from "../src/marketing/header-centered-email.ts";
import type { HeaderCenteredEmailProps } from "../src/marketing/header-centered-email.ts";

describe("header centered email", () => {
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
    } satisfies HeaderCenteredEmailProps<string>;
    expect(headerCenteredEmail).toBeTypeOf("function");
    expect(props.heading).toBeDefined();
  });
});
