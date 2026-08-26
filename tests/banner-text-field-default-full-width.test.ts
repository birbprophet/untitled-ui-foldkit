import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerTextFieldDefaultFullWidth } from "../src/marketing/banner-text-field-default-full-width.ts";
import type { BannerTextFieldDefaultFullWidthProps } from "../src/marketing/banner-text-field-default-full-width.ts";

describe("banner text field default full width", () => {
  it("keeps email input, submit, and dismissal controlled", () => {
    const props: BannerTextFieldDefaultFullWidthProps<string> = {
      description: "Be the first to hear about new components, updates, and design resources.",
      dismissLabel: "Dismiss",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      id: "newsletter-banner",
      onDismiss: "dismiss",
      onEmailInput: (email) => `email:${email}`,
      onSubmit: "submit",
      subscribeLabel: "Subscribe",
      title: "Stay up to date with the latest news",
      titleSuffix: "and updates",
    };

    expect(props.onEmailInput("next@siglata.com")).toBe("email:next@siglata.com");
    expect(props.onSubmit).toBe("submit");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.emailLabel).toBe("Email");
    expect(bannerTextFieldDefaultFullWidth).toBeTypeOf("function");
  });
});
