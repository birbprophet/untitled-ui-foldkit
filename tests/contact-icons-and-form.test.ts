import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactIconsAndForm } from "../src/marketing/contact-icons-and-form.ts";
import type { ContactIconsAndFormProps } from "../src/marketing/contact-icons-and-form.ts";

describe("contact icons and form", () => {
  it("keeps contact links, fields, consent, and submission controlled", () => {
    const props = {
      contactMethods: [
        {
          cta: "hi@siglata.com",
          href: "mailto:hi@siglata.com",
          icon: "mail",
          id: "email",
          subtitle: "Our friendly team is here to help.",
          title: "Email",
        },
      ],
      description: "We'd love to hear from you.",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      eyebrow: "Contact us",
      firstName: "Olivia",
      firstNameLabel: "First name",
      firstNamePlaceholder: "First name",
      heading: "Chat to our friendly team",
      lastName: "Rhye",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Last name",
      message: "Hello",
      messageLabel: "Message",
      messagePlaceholder: "Leave us a message...",
      onContact: (id: string) => `contact:${id}`,
      onEmailInput: (value: string) => `email:${value}`,
      onFirstNameInput: (value: string) => `first:${value}`,
      onLastNameInput: (value: string) => `last:${value}`,
      onMessageInput: (value: string) => `message:${value}`,
      onPrivacyToggle: "privacy",
      onSubmit: "submit",
      privacyAccepted: true,
      privacyHref: "#privacy",
      privacyLabel: "privacy policy.",
      privacyPrefix: "You agree to our friendly",
      submitLabel: "Send message",
    } satisfies ContactIconsAndFormProps<string>;

    expect(props.onContact("email")).toBe("contact:email");
    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect(props.onPrivacyToggle).toBe("privacy");
    expect(props.onSubmit).toBe("submit");
    expect(contactIconsAndForm).toBeTypeOf("function");
  });
});
