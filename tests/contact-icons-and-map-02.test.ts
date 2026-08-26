import { describe, it } from "@effect/vitest";

import {
  contactIconsAndMap02,
  contactIconsAndMap02Locations,
} from "../src/marketing/contact-icons-and-map-02.ts";
import type { ContactIconsAndMap02Props } from "../src/marketing/contact-icons-and-map-02.ts";
import { expect } from "./assertions.ts";

describe("contact icons and map 02", () => {
  it("preserves the two source locations and named map", () => {
    const props = {
      description: "Come visit our friendly team at one of our offices.",
      eyebrow: "Contact us",
      heading: "Our locations",
      locations: contactIconsAndMap02Locations,
      mapSrc: "https://snazzymaps.com/embed/451871",
      mapTitle: "Our address",
    } satisfies ContactIconsAndMap02Props;

    expect(contactIconsAndMap02Locations).toHaveLength(2);
    expect(contactIconsAndMap02Locations[0]?.name).toBe("Melbourne");
    expect(contactIconsAndMap02Locations[1]?.address).toBe("100 George Street, Sydney NSW 2000 AU");
    expect(props.mapSrc).toBe("https://snazzymaps.com/embed/451871");
    expect(props.mapTitle).toBe("Our address");
    expect(contactIconsAndMap02).toBeTypeOf("function");
  });
});
