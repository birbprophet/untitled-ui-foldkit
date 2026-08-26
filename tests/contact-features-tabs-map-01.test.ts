import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactFeaturesTabsMap01 } from "../src/marketing/contact-features-tabs-map-01.ts";
import type { ContactFeaturesTabsMap01Props } from "../src/marketing/contact-features-tabs-map-01.ts";

describe("contact features tabs map 01", () => {
  it("keeps map location selection controlled", () => {
    const props = {
      badgeLabel: "Stores",
      description: "Say hello to our friendly team at one of these locations.",
      heading: "Our locations",
      locations: [
        {
          id: "melbourne",
          subtitle: "100 Flinders Street\nMelbourne VIC 3000 AU",
          title: "Melbourne",
        },
        {
          id: "sydney",
          subtitle: "100 George Street\nSydney NSW 2000 AU",
          title: "Sydney",
        },
      ],
      mapSrc: "https://snazzymaps.com/embed/451894",
      mapTitle: "Our address",
      onSelect: (id: string) => `select:${id}`,
      selectedId: "melbourne",
    } satisfies ContactFeaturesTabsMap01Props<string>;

    expect(props.onSelect("sydney")).toBe("select:sydney");
    expect(props.selectedId).toBe("melbourne");
    expect(props.mapTitle).toBe("Our address");
    expect(contactFeaturesTabsMap01).toBeTypeOf("function");
  });
});
