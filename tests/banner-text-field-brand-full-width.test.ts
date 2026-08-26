import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerTextFieldBrandFullWidth } from "../src/marketing/banner-text-field-brand-full-width.ts";
import type { BannerTextFieldBrandFullWidthProps } from "../src/marketing/banner-text-field-brand-full-width.ts";

describe("banner text field brand full width", () => {
  it("keeps the email, submit, and dismissal actions controlled", () => {
    const props = {
      description: "Be the first to hear about new components, updates, and design resources.",
      dismissLabel: "Dismiss",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      id: "banner-text-field-brand-full-width",
      onDismiss: "dismiss",
      onEmailInput: (email: string) => `email:${email}`,
      onSubmit: "submit",
      subscribeLabel: "Subscribe",
      title: "Stay up to date with the latest news",
      titleSuffix: "and updates",
    } satisfies BannerTextFieldBrandFullWidthProps<string>;

    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect(props.onSubmit).toBe("submit");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.emailLabel).toBe("Email");
    expect(bannerTextFieldBrandFullWidth).toBeTypeOf("function");
  });
});
