import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactMap02 } from "../src/marketing/contact-map-02.ts";
import type { ContactMap02Props } from "../src/marketing/contact-map-02.ts";

describe("contact map 02", () => {
  it("keeps map-pin activation and contact navigation controlled", () => {
    const props = {
      contacts: [
        {
          cta: "support@siglata.com",
          href: "mailto:support@siglata.com",
          id: "support",
          subtitle: "Our friendly team is here to help.",
          title: "Support",
        },
      ],
      description: "We have offices and teams all around the world.",
      eyebrow: "Contact us",
      heading: "We'd love to hear from you",
      mapDarkSrc: "https://www.untitledui.com/marketing/world-map-dark-mode.svg",
      mapLightSrc: "https://www.untitledui.com/marketing/world-map-light-mode.svg",
      onContact: (id: string) => `contact:${id}`,
      onPinActivate: (id: string) => `pin:${id}`,
      pins: [
        {
          address: "911 E Pike Street, Capitol Hill, Seattle, WA 98122",
          flagSrc: "https://www.untitledui.com/images/flags/US.svg",
          id: "seattle",
          location: "Seattle, USA",
          x: 130,
          y: 157,
        },
      ],
      selectedPinId: "seattle",
    } satisfies ContactMap02Props<string>;
    expect(props.onPinActivate("seattle")).toBe("pin:seattle");
    expect(props.onContact("support")).toBe("contact:support");
    expect(props.pins[0]?.location).toBe("Seattle, USA");
    expect(props.selectedPinId).toBe("seattle");
    expect(contactMap02).toBeTypeOf("function");
  });
});
