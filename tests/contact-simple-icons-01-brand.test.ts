import { describe, it } from "@effect/vitest";

import {
  contactSimpleIcons01Brand,
  contactSimpleIcons01BrandItems,
} from "../src/marketing/contact-simple-icons-01-brand.ts";
import type { ContactSimpleIcons01BrandProps } from "../src/marketing/contact-simple-icons-01-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-icons-01-brand", () => {
  it("preserves the authenticated three-item fixture with the approved product-name delta", () => {
    const props = {
      items: contactSimpleIcons01BrandItems,
      onContact: () => "contact",
    } satisfies ContactSimpleIcons01BrandProps<string>;

    expect(props.items).toHaveLength(3);
    expect(props.items.map(({ icon }) => icon)).toEqual(["email", "office", "phone"]);
    expect(props.items[0]?.cta).toBe("hi@siglata.com");
    expect(props.items[1]?.cta).toBe("100 Smith Street\nCollingwood VIC 3066 AU");
    expect(props.items[2]?.cta).toBe("+1 (555) 000-0000");
    expect(contactSimpleIcons01Brand).toBeTypeOf("function");
  });

  it("keeps every native contact destination and identifier exact", () => {
    expect(contactSimpleIcons01BrandItems.map(({ href }) => href)).toEqual([
      "mailto:hi@siglata.com",
      "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
      "tel:+1 (555) 000-0000",
    ]);
    expect(new Set(contactSimpleIcons01BrandItems.map(({ id }) => id)).size).toBe(3);
  });
});
