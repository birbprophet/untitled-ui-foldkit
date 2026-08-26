import { describe, it } from "@effect/vitest";

import {
  contactFormAndImage01,
  contactFormAndImage01Countries,
} from "../src/marketing/contact-form-and-image-01.ts";
import type { ContactFormAndImage01Props } from "../src/marketing/contact-form-and-image-01.ts";
import { expect } from "./assertions.ts";

describe("contact form and image 01", () => {
  it("preserves controlled fields, validation, and country masks", () => {
    const props = {
      countries: contactFormAndImage01Countries,
      countryCodeLabel: "Country code",
      description: "Our friendly team would love to hear from you.",
      email: "",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      errors: { email: "Enter a valid email" },
      firstName: "",
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Contact us",
      imageAlt: "Smiling girl",
      imageSrc: "https://www.untitledui.com/marketing/smiling-girl-12.webp",
      lastName: "",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      message: "",
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
      phone: "",
      phoneLabel: "Phone number",
      privacyAccepted: false,
      privacyHref: "#",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      selectedCountryId: "US",
      submitLabel: "Send message",
    } satisfies ContactFormAndImage01Props<string>;

    expect(contactFormAndImage01Countries.find(({ id }) => id === "US")?.phoneMask).toBe(
      "+1 (###) ###-####",
    );
    expect(contactFormAndImage01Countries.find(({ id }) => id === "BR")?.phoneMask).toBe(
      "+55 (##) 9####-####",
    );
    expect(props.onCountryChange("BR")).toBe("country:BR");
    expect(props.onEmailInput("hello@example.com")).toBe("email:hello@example.com");
    expect(props.errors.email).toBe("Enter a valid email");
    expect(contactFormAndImage01).toBeTypeOf("function");
  });
});
