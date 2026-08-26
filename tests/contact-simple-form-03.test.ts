import { describe, it } from "@effect/vitest";

import {
  contactSimpleForm03,
  contactSimpleForm03Countries,
  contactSimpleForm03Services,
} from "../src/marketing/contact-simple-form-03.ts";
import type { ContactSimpleForm03Props } from "../src/marketing/contact-simple-form-03.ts";
import { expect } from "./assertions.ts";

describe("contact simple form 03", () => {
  it("preserves service choices and controlled form actions", () => {
    const props = {
      contactEmail: "hi@siglata.com",
      countries: contactSimpleForm03Countries,
      countryCodeLabel: "Country code",
      descriptionPrefix: "You can reach us anytime via",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      errors: { email: "Enter a valid email address." },
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Let's level up your brand, together",
      imageAlt: "Woman artist",
      imageSrc: "https://www.untitledui.com/marketing/woman-artist.webp",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      messageLabel: "Message",
      messagePlaceholder: "Leave us a message...",
      onCountryChange: (code: string) => `country:${code}`,
      onFieldInput: (field: string, value: string) => `${field}:${value}`,
      onServiceToggle: (id: string) => `service:${id}`,
      onSubmit: "submit",
      phoneLabel: "Phone number",
      services: contactSimpleForm03Services,
      servicesLabel: "Services",
      submitLabel: "Get started",
      values: {
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phone: "",
        selectedCountryPhone: "US",
        selectedServices: [],
      },
    } satisfies ContactSimpleForm03Props<string>;

    expect(contactSimpleForm03Services).toHaveLength(6);
    expect(contactSimpleForm03Countries.find(({ code }) => code === "BR")?.phoneMask).toBe(
      "+55 (##) 9####-####",
    );
    expect(props.onCountryChange("BR")).toBe("country:BR");
    expect(props.onFieldInput("message", "Hello")).toBe("message:Hello");
    expect(props.onServiceToggle("design")).toBe("service:design");
    expect(props.contactEmail).toBe("hi@siglata.com");
    expect(contactSimpleForm03).toBeTypeOf("function");
  });
});
