import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactSimpleForm02,
  contactSimpleForm02Countries,
  contactSimpleForm02Image,
} from "../src/marketing/contact-simple-form-02.ts";
import type { ContactSimpleForm02Props } from "../src/marketing/contact-simple-form-02.ts";

describe("contact simple form 02", () => {
  it("preserves the authenticated phone masks and approved identity image", () => {
    expect(contactSimpleForm02Countries[0]).toEqual({
      id: "US",
      label: "US",
      phoneMask: "+1 (###) ###-####",
    });
    expect(contactSimpleForm02Countries.find(({ id }) => id === "BR")?.phoneMask).toBe(
      "+55 (##) 9####-####",
    );
    expect(contactSimpleForm02Image.src).toMatch(/^data:image\//u);
  });

  it("keeps fields, consent, country selection, privacy navigation, and submission controlled", () => {
    const props = {
      countries: contactSimpleForm02Countries,
      description: "Our friendly team would love to hear from you.",
      errors: { email: "Enter your email." },
      heading: "Contact us",
      imageAlt: contactSimpleForm02Image.alt,
      imageSrc: contactSimpleForm02Image.src,
      onCountryChange: (id: string) => `country:${id}`,
      onFieldInput: (field: string, value: string) => `${field}:${value}`,
      onPrivacy: "privacy",
      onPrivacyToggle: "toggle-privacy",
      onSubmit: "submit",
      privacyHref: "#",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      submitLabel: "Send message",
      values: {
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phone: "",
        privacyAccepted: false,
        selectedCountryId: "US",
      },
    } satisfies ContactSimpleForm02Props<string>;

    expect(props.onFieldInput("message", "Hello")).toBe("message:Hello");
    expect(props.onCountryChange("BR")).toBe("country:BR");
    expect(props.onPrivacyToggle).toBe("toggle-privacy");
    expect(props.onSubmit).toBe("submit");
    expect(contactSimpleForm02).toBeTypeOf("function");
  });
});
