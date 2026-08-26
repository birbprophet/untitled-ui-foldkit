import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactFeaturesTabsMap02 } from "../src/marketing/contact-features-tabs-map-02.ts";
import type { ContactFeaturesTabsMap02Props } from "../src/marketing/contact-features-tabs-map-02.ts";

describe("contact features tabs map 02", () => {
  it("keeps selected location and store navigation controlled", () => {
    const props = {
      description: "Say hello to our friendly team at one of these locations.",
      eyebrow: "Our locations",
      heading: "Visit our stores",
      locations: [
        {
          address: "100 Flinders Street\nMelbourne VIC 3000 AU",
          ctaLabel: "View store",
          href: "#melbourne",
          id: "melbourne",
          title: "Melbourne",
        },
      ],
      mapTitle: "Our address",
      mapUrl: "https://snazzymaps.com/embed/451871",
      onLocationSelect: (id: string) => `select:${id}`,
      onViewLocation: (id: string) => `view:${id}`,
      selectedLocationId: "melbourne",
    } satisfies ContactFeaturesTabsMap02Props<string>;
    expect(props.onLocationSelect("melbourne")).toBe("select:melbourne");
    expect(props.onViewLocation("melbourne")).toBe("view:melbourne");
    expect(props.mapUrl).toBe("https://snazzymaps.com/embed/451871");
    expect(contactFeaturesTabsMap02).toBeTypeOf("function");
  });
});
