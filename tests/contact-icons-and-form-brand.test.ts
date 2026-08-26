import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contactIconsAndFormBrand } from "../src/marketing/contact-icons-and-form-brand.ts";
import type { ContactIconsAndFormBrandProps } from "../src/marketing/contact-icons-and-form-brand.ts";

describe("contact icons and form brand", () => {
  it("keeps contact navigation, fields, privacy, validation, and submission controlled", () => {
    const props = {
      contacts: [
        {
          cta: "hi@siglata.com",
          href: "mailto:hi@siglata.com",
          icon: "email",
          id: "email",
          subtitle: "Our friendly team is here to help.",
          title: "Email",
        },
      ],
      description: "We'd love to hear from you. Please fill out this form or shoot us an email.",
      email: "",
      eyebrow: "Contact us",
      firstName: "",
      heading: "Chat to our friendly team",
      invalidFields: ["email"],
      lastName: "",
      message: "",
      onContact: (id: string) => `contact:${id}`,
      onFieldInput: (field: string, value: string) => `${field}:${value}`,
      onPrivacyToggle: "privacy",
      onSubmit: "submit",
      privacyAccepted: false,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      submitLabel: "Send message",
    } satisfies ContactIconsAndFormBrandProps<string>;
    expect(props.onContact("email")).toBe("contact:email");
    expect(props.onFieldInput("email", "reader@example.com")).toBe("email:reader@example.com");
    expect(props.onPrivacyToggle).toBe("privacy");
    expect(props.onSubmit).toBe("submit");
    expect(props.invalidFields).toEqual(["email"]);
    expect(contactIconsAndFormBrand).toBeTypeOf("function");
  });
});
