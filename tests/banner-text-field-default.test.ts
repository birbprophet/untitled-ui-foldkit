import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerTextFieldDefault } from "../src/marketing/banner-text-field-default.ts";
import type { BannerTextFieldDefaultProps } from "../src/marketing/banner-text-field-default.ts";

describe("banner text field default", () => {
  it("keeps the required email value, submit action, and dismissal controlled", () => {
    const props: BannerTextFieldDefaultProps<string> = {
      description: "Be the first to hear about new components, updates, and design resources.",
      dismissLabel: "Dismiss",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      id: "banner-text-field-default",
      onDismiss: "dismiss",
      onEmailInput: (email) => `email:${email}`,
      onSubmit: "submit",
      subscribeLabel: "Subscribe",
      title: "Stay up to date with the latest news",
      titleSuffix: "and updates",
    };

    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect([props.onSubmit, props.onDismiss]).toEqual(["submit", "dismiss"]);
    expect(props.emailLabel).toBe("Email");
    expect(bannerTextFieldDefault).toBeTypeOf("function");
  });
});
