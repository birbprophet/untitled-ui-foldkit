import { describe, it } from "@effect/vitest";

import {
  contactSimpleIcons04Brand,
  contactSimpleIcons04BrandLocations,
} from "../src/marketing/contact-simple-icons-04-brand.ts";
import type { ContactSimpleIcons04BrandProps } from "../src/marketing/contact-simple-icons-04-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-icons-04-brand", () => {
  it("keeps the authenticated six-location fixture and source ordering", () => {
    expect(contactSimpleIcons04BrandLocations).toHaveLength(6);
    expect(contactSimpleIcons04BrandLocations.map(({ name }) => name)).toEqual([
      "Melbourne",
      "Sydney",
      "Byron Bay",
      "London",
      "San Francisco",
      "Sweden",
    ]);
    expect(contactSimpleIcons04BrandLocations[0]?.address).toBe(
      "100 Flinders Street\nMelbourne VIC 3000 AU",
    );
    expect(contactSimpleIcons04BrandLocations[5]?.address).toBe(
      "Drottninggatan 100\n111 60 Stockholm SE",
    );
  });

  it("exposes only the source-controlled static content props", () => {
    const props: ContactSimpleIcons04BrandProps = {
      description: "Find us at these locations.",
      eyebrow: "Our locations",
      heading: "Visit our stores",
      locations: contactSimpleIcons04BrandLocations,
    };

    expect(props.locations).toBe(contactSimpleIcons04BrandLocations);
    expect(contactSimpleIcons04Brand).toBeTypeOf("function");
  });
});
