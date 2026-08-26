import { describe, it } from "@effect/vitest";

import {
  contactSimpleIcons03Brand,
  contactSimpleIcons03BrandItems,
} from "../src/marketing/contact-simple-icons-03-brand.ts";
import type { ContactSimpleIcons03BrandProps } from "../src/marketing/contact-simple-icons-03-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-icons-03-brand", () => {
  it("keeps every contact action controlled", () => {
    const props: ContactSimpleIcons03BrandProps<string> = {
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      items: contactSimpleIcons03BrandItems,
      onActivate: (id) => `activate:${id}`,
    };

    expect(props.onActivate("email")).toBe("activate:email");
    expect(props.onActivate("office")).toBe("activate:office");
    expect(typeof contactSimpleIcons03Brand).toBe("function");
  });

  it("preserves the three exact source roles and multiline office address", () => {
    expect(contactSimpleIcons03BrandItems).toHaveLength(3);
    expect(contactSimpleIcons03BrandItems.map(({ icon }) => icon)).toEqual([
      "email",
      "location",
      "phone",
    ]);
    expect(contactSimpleIcons03BrandItems[1]?.cta).toContain("\n");
    expect(new Set(contactSimpleIcons03BrandItems.map(({ id }) => id)).size).toBe(3);
  });
});
