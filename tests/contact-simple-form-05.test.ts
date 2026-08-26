import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactSimpleForm05 } from "../src/marketing/contact-simple-form-05.ts";
import type { ContactSimpleForm05Props } from "../src/marketing/contact-simple-form-05.ts";

describe("contact simple form 05", () => {
  it("keeps fields, country, services, privacy, navigation, and submission controlled", () => {
    const props = {
      contactEmail: "hi@siglata.com",
      contacts: [],
      countries: [{ code: "US", phoneMask: "+1 (###) ###-####" }],
      errors: { email: "", firstName: "", lastName: "", message: "", phone: "" },
      onContact: (id: string) => `contact:${id}`,
      onCountryChange: (code: string) => `country:${code}`,
      onFieldInput: (field: string, value: string) => `${field}:${value}`,
      onPrivacyToggle: "privacy",
      onServiceToggle: (id: string) => `service:${id}`,
      onSocial: (id: string) => `social:${id}`,
      onSubmit: "submit",
      privacyHref: "#privacy",
      services: [{ id: "design", label: "Website design" }],
      socials: [],
      submitDesktopLabel: "Get started",
      submitMobileLabel: "Send message",
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
    } satisfies ContactSimpleForm05Props<string>;
    expect(props.onCountryChange("US")).toBe("country:US");
    expect(props.onFieldInput("email", "reader@example.com")).toBe("email:reader@example.com");
    expect(props.onServiceToggle("design")).toBe("service:design");
    expect(props.onPrivacyToggle).toBe("privacy");
    expect(props.onSubmit).toBe("submit");
    expect(contactSimpleForm05).toBeTypeOf("function");
  });
});
