import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactIconsAndMap02Brand,
  contactIconsAndMap02BrandLocations,
  contactIconsAndMap02BrandMap,
} from "../src/marketing/contact-icons-and-map-02-brand.ts";
import type { ContactIconsAndMap02BrandProps } from "../src/marketing/contact-icons-and-map-02-brand.ts";

describe("contact icons and map 02 brand", () => {
  it("preserves the authenticated location and map fixtures", () => {
    expect(contactIconsAndMap02BrandLocations).toEqual([
      {
        id: "melbourne",
        subtitle: "100 Flinders Street, Melbourne VIC 3000 AU",
        title: "Melbourne",
      },
      {
        id: "sydney",
        subtitle: "100 George Street, Sydney NSW 2000 AU",
        title: "Sydney",
      },
    ]);
    expect(contactIconsAndMap02BrandMap).toEqual({
      src: "https://snazzymaps.com/embed/451871",
      title: "Our address",
    });
  });

  it("accepts the complete static branded contact contract", () => {
    const props = {
      description: "Come visit our friendly team at one of our offices.",
      eyebrow: "Contact us",
      heading: "Our locations",
      locations: contactIconsAndMap02BrandLocations,
      mapSrc: contactIconsAndMap02BrandMap.src,
      mapTitle: contactIconsAndMap02BrandMap.title,
    } satisfies ContactIconsAndMap02BrandProps;

    expect(props.locations).toHaveLength(2);
    expect(props.mapTitle).toBe("Our address");
    expect(contactIconsAndMap02Brand).toBeTypeOf("function");
  });
});
