import { describe, it } from "@effect/vitest";

import {
  contactSimpleForm04,
  contactSimpleForm04Contacts,
  contactSimpleForm04Countries,
  contactSimpleForm04Socials,
} from "../src/marketing/contact-simple-form-04.ts";
import type { ContactSimpleForm04Props } from "../src/marketing/contact-simple-form-04.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-form-04", () => {
  it("keeps form, contact, social, and privacy interactions controlled", () => {
    const props: ContactSimpleForm04Props<string> = {
      contacts: contactSimpleForm04Contacts,
      countries: contactSimpleForm04Countries,
      countryCodeLabel: "Country code",
      desktopDescription: "We' love to hear from you.",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Get in touch",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      messageLabel: "Message",
      messagePlaceholder: "Leave us a message...",
      mobileDescription: "We'd love to hear from you.",
      onContact: (id) => `contact:${id}`,
      onCountryChange: (id) => `country:${id}`,
      onFieldInput: (field, value) => `${field}:${value}`,
      onPrivacyPolicy: "privacy-policy",
      onPrivacyToggle: "privacy-toggle",
      onSocial: (id) => `social:${id}`,
      onSubmit: "submit",
      phoneLabel: "Phone number",
      privacyHref: "#",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      socials: contactSimpleForm04Socials,
      submitLabel: "Send message",
      values: {
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phone: "",
        privacyAccepted: false,
        selectedCountryPhone: "US",
      },
    };

    expect(props.onFieldInput("email", "olivia@example.com")).toBe("email:olivia@example.com");
    expect(props.onCountryChange("BR")).toBe("country:BR");
    expect(props.onContact("chat")).toBe("contact:chat");
    expect(props.onSocial("linkedin")).toBe("social:linkedin");
    expect(props.onPrivacyToggle).toBe("privacy-toggle");
    expect(props.onSubmit).toBe("submit");
    expect(typeof contactSimpleForm04).toBe("function");
  });

  it("preserves source fixture order and the explicit Siglata identity delta", () => {
    expect(contactSimpleForm04Contacts.map(({ icon }) => icon)).toEqual([
      "chat",
      "office",
      "phone",
    ]);
    expect(contactSimpleForm04Contacts[0]?.cta).toBe("hi@siglata.com");
    expect(contactSimpleForm04Socials.map(({ title }) => title)).toEqual([
      "Facebook",
      "X",
      "LinkedIn",
      "YouTube",
      "Dribbble",
    ]);
    expect(contactSimpleForm04Countries.find(({ id }) => id === "BR")?.phoneMask).toBe(
      "+55 (##) 9####-####",
    );
  });
});
