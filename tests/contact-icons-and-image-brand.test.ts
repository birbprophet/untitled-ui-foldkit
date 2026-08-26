import { describe, it } from "@effect/vitest";

import {
  contactIconsAndImageBrand,
  contactIconsAndImageBrandImageUrl,
  contactIconsAndImageBrandLocations,
} from "../src/marketing/contact-icons-and-image-brand.ts";
import type { ContactIconsAndImageBrandProps } from "../src/marketing/contact-icons-and-image-brand.ts";
import { expect } from "./assertions.ts";

describe("contact-icons-and-image-brand", () => {
  it("preserves the exact two-location source fixture", () => {
    const props: ContactIconsAndImageBrandProps = {
      description: "We'd love to hear from you! Please get in touch.",
      eyebrow: "Contact us",
      heading: "Chat to our friendly team",
      imageAlt: "Team discussing a topic",
      imageUrl: contactIconsAndImageBrandImageUrl,
      locations: contactIconsAndImageBrandLocations,
    };

    expect(props.locations).toHaveLength(2);
    expect(props.locations[0]?.title).toBe("Melbourne");
    expect(props.locations[1]?.title).toBe("Sydney");
    expect(props.imageUrl).toBe("https://www.untitledui.com/marketing/interview-2.webp");
    expect(typeof contactIconsAndImageBrand).toBe("function");
  });

  it("keeps location identifiers unique and both addresses exact", () => {
    expect(new Set(contactIconsAndImageBrandLocations.map(({ id }) => id)).size).toBe(2);
    expect(contactIconsAndImageBrandLocations[0]?.address).toBe(
      "100 Flinders Street, Melbourne VIC 3000 AU",
    );
    expect(contactIconsAndImageBrandLocations[1]?.address).toBe(
      "100 George Street, Sydney NSW 2000 AU",
    );
  });
});
