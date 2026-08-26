import { describe, it } from "@effect/vitest";

import {
  contactSimpleIcons02Brand,
  contactSimpleIcons02BrandItems,
} from "../src/marketing/contact-simple-icons-02-brand.ts";
import type { ContactSimpleIcons02BrandProps } from "../src/marketing/contact-simple-icons-02-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-icons-02-brand", () => {
  it("keeps each contact destination controlled by its stable source ID", () => {
    const props: ContactSimpleIcons02BrandProps<string> = {
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      items: contactSimpleIcons02BrandItems,
      onContact: (id) => `contact:${id}`,
    };

    expect(contactSimpleIcons02BrandItems.map(({ id }) => props.onContact(id))).toEqual([
      "contact:email",
      "contact:office",
      "contact:phone",
    ]);
    expect(contactSimpleIcons02Brand).toBeTypeOf("function");
  });

  it("preserves contact order, multiline office copy, and the product-name delta", () => {
    expect(contactSimpleIcons02BrandItems.map(({ icon }) => icon)).toEqual([
      "email",
      "office",
      "phone",
    ]);
    expect(contactSimpleIcons02BrandItems[0]?.cta).toBe("hi@siglata.com");
    expect(contactSimpleIcons02BrandItems[1]?.cta).toContain("\n");
  });
});
