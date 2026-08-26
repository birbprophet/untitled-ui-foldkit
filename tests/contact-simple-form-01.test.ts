import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactSimpleForm01,
  contactSimpleForm01Countries,
} from "../src/marketing/contact-simple-form-01.ts";
import type { ContactSimpleForm01Props } from "../src/marketing/contact-simple-form-01.ts";

describe("contact simple form 01", () => {
  it("keeps all fields, country, consent, and submission controlled", () => {
    const props = {
      countries: contactSimpleForm01Countries,
      countryCodeLabel: "Country code",
      description: "We'd love to hear from you. Please fill out this form.",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      eyebrow: "Contact us",
      firstName: "Olivia",
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Get in touch",
      lastName: "Rhye",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      message: "Hello",
      messageLabel: "Message",
      messagePlaceholder: "Leave us a message...",
      onCountryChange: (id: string) => `country:${id}`,
      onEmailInput: (value: string) => `email:${value}`,
      onFirstNameInput: (value: string) => `first:${value}`,
      onLastNameInput: (value: string) => `last:${value}`,
      onMessageInput: (value: string) => `message:${value}`,
      onPhoneInput: (value: string) => `phone:${value}`,
      onPrivacyToggle: "privacy",
      onSubmit: "submit",
      phone: "+55 11 99999-9999",
      phoneLabel: "Phone number",
      privacyAccepted: true,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      selectedCountryId: "BR",
      submitLabel: "Send message",
    } satisfies ContactSimpleForm01Props<string>;

    expect(props.onCountryChange("US")).toBe("country:US");
    expect(props.onPhoneInput("555")).toBe("phone:555");
    expect(props.onPrivacyToggle).toBe("privacy");
    expect(props.onSubmit).toBe("submit");
    expect(contactSimpleForm01).toBeTypeOf("function");
  });
});
