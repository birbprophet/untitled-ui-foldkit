import { describe, it } from "@effect/vitest";

import {
  contactMap01,
  contactMap01Locations,
  contactMap01MapSrc,
} from "../src/marketing/contact-map-01.ts";
import type { ContactMap01Props } from "../src/marketing/contact-map-01.ts";
import { expect } from "./assertions.ts";

describe("contact-map-01", () => {
  it("keeps location activation controlled", () => {
    const props: ContactMap01Props<string> = {
      description: "Come visit our friendly team at one of our offices.",
      eyebrow: "Contact us",
      heading: "Our locations",
      locations: contactMap01Locations,
      mapSrc: contactMap01MapSrc,
      mapTitle: "Our address",
      onLocation: (id) => `location:${id}`,
    };

    expect(props.onLocation("retail-store")).toBe("location:retail-store");
    expect(props.mapTitle).toBe("Our address");
    expect(typeof contactMap01).toBe("function");
  });

  it("preserves all three exact source locations and multiline addresses", () => {
    expect(contactMap01Locations).toHaveLength(3);
    expect(new Set(contactMap01Locations.map(({ id }) => id)).size).toBe(3);
    expect(contactMap01Locations.every(({ address }) => address.includes("\n"))).toBe(true);
    expect(contactMap01Locations[0]?.schedule).toBe("Mon-Sat 9am to 5pm.");
    expect(contactMap01MapSrc).toBe("https://snazzymaps.com/embed/451894");
  });
});
