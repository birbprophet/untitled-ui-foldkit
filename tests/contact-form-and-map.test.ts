import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactFormAndMap } from "../src/marketing/contact-form-and-map.ts";
import type { ContactFormAndMapProps } from "../src/marketing/contact-form-and-map.ts";

describe("contact form and map", () => {
  it("keeps fields, country, privacy, and submission controlled", () => {
    const props = {
      countryCodeLabel: "Country code",
      description: "Our friendly team would love to hear from you.",
      email: "",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      firstName: "",
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Contact us",
      lastName: "",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      mapSrc: "https://snazzymaps.com/embed/451871",
      mapTitle: "Our address",
      message: "",
      messageLabel: "Message",
      messagePlaceholder: "Leave us a message...",
      onCountryCodeChange: (code: string) => `country:${code}`,
      onEmailInput: (email: string) => `email:${email}`,
      onFirstNameInput: (name: string) => `first:${name}`,
      onLastNameInput: (name: string) => `last:${name}`,
      onMessageInput: (message: string) => `message:${message}`,
      onPhoneInput: (phone: string) => `phone:${phone}`,
      onPrivacyPolicy: "privacy-policy",
      onPrivacyToggle: "privacy-toggle",
      onSubmit: "submit",
      phone: "",
      phoneLabel: "Phone number",
      phoneOptions: [{ code: "US", label: "US", placeholder: "+1 (000) 000-0000" }],
      privacyChecked: false,
      privacyCopy: "You agree to our friendly",
      privacyHref: "#privacy",
      privacyLabel: "privacy policy.",
      selectedCountryCode: "US",
      submitLabel: "Send message",
    } satisfies ContactFormAndMapProps<string>;

    expect(props.onCountryCodeChange("BR")).toBe("country:BR");
    expect(props.onEmailInput("operator@siglata.com")).toBe("email:operator@siglata.com");
    expect(props.onPrivacyToggle).toBe("privacy-toggle");
    expect(props.onSubmit).toBe("submit");
    expect(contactFormAndMap).toBeTypeOf("function");
  });
});
