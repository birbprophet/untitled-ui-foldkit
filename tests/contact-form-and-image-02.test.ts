import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactFormAndImage02 } from "../src/marketing/contact-form-and-image-02.ts";
import type { ContactFormAndImage02Props } from "../src/marketing/contact-form-and-image-02.ts";

describe("contact form and image 02", () => {
  it("keeps fields, selection, validation, and submission controlled", () => {
    const props = {
      contactEmail: "hi@siglata.com",
      countries: [
        { code: "US", phoneMask: "+1 (###) ###-####" },
        { code: "BR", phoneMask: "+55 (##) 9####-####" },
      ],
      descriptionPrefix: "You can reach us anytime via",
      desktopSubmitLabel: "Get started",
      errors: { email: "Enter a valid email address." },
      heading: "Let's level up your brand, together",
      imageAlt: "Split image",
      imageSrc: "https://www.untitledui.com/marketing/split-image-01.webp",
      mobileSubmitLabel: "Send message",
      onCountryChange: () => "country",
      onFieldInput: () => "field",
      onPrivacyToggle: "privacy",
      onServiceToggle: () => "service",
      onSubmit: "submit",
      privacyHref: "#privacy",
      services: [{ id: "design", label: "Website design" }],
      values: {
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phone: "",
        privacyAccepted: false,
        selectedCountryPhone: "US",
        selectedServices: [],
      },
    } satisfies ContactFormAndImage02Props<string>;

    expect(props).toMatchObject({
      contactEmail: "hi@siglata.com",
      desktopSubmitLabel: "Get started",
      onPrivacyToggle: "privacy",
      onSubmit: "submit",
    });
    expect(contactFormAndImage02).toBeTypeOf("function");
  });
});
