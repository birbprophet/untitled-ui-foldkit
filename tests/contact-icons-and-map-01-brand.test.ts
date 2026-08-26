import { describe, it } from "@effect/vitest";

import {
  contactIconsAndMap01Brand,
  contactIconsAndMap01BrandItems,
} from "../src/marketing/contact-icons-and-map-01-brand.ts";
import type { ContactIconsAndMap01BrandProps } from "../src/marketing/contact-icons-and-map-01-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-icons-and-map-01-brand", () => {
  it("keeps each contact action controlled by its stable source ID", () => {
    const props: ContactIconsAndMap01BrandProps<string> = {
      description: "Our friendly team would love to hear from you.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      items: contactIconsAndMap01BrandItems,
      mapSrc: "https://snazzymaps.com/embed/451894",
      mapTitle: "Our address",
      onContact: (id) => `contact:${id}`,
    };

    expect(props.onContact("email")).toBe("contact:email");
    expect(props.onContact("office")).toBe("contact:office");
    expect(props.onContact("phone")).toBe("contact:phone");
    expect(typeof contactIconsAndMap01Brand).toBe("function");
  });

  it("preserves the source contact order and registered product-name delta", () => {
    expect(contactIconsAndMap01BrandItems.map(({ icon }) => icon)).toEqual([
      "email",
      "office",
      "phone",
    ]);
    expect(contactIconsAndMap01BrandItems[0]?.cta).toBe("hi@siglata.com");
    expect(contactIconsAndMap01BrandItems[1]?.cta).toContain("\n");
    expect(new Set(contactIconsAndMap01BrandItems.map(({ id }) => id)).size).toBe(3);
  });
});
