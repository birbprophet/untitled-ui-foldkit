import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerTextFieldBrand } from "../src/marketing/banner-text-field-brand.ts";
import type { BannerTextFieldBrandProps } from "../src/marketing/banner-text-field-brand.ts";

describe("banner text field brand", () => {
  it("keeps brand banner input and actions controlled", () => {
    const props: BannerTextFieldBrandProps<string> = {
      description: "Be the first to hear about new components, updates, and design resources.",
      dismissLabel: "Dismiss",
      email: "operator@siglata.com",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      id: "banner-text-field-brand",
      onDismiss: "dismiss",
      onEmailInput: (email) => `email:${email}`,
      onSubmit: "submit",
      subscribeLabel: "Subscribe",
      title: "Stay up to date with the latest news",
      titleSuffix: "and updates",
    };

    expect(props.onEmailInput("news@siglata.com")).toBe("email:news@siglata.com");
    expect(props.onSubmit).toBe("submit");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.emailLabel).toBe("Email");
    expect(typeof bannerTextFieldBrand).toBe("function");
  });
});
