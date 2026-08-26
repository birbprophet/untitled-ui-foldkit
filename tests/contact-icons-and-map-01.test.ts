import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactIconsAndMap01 } from "../src/marketing/contact-icons-and-map-01.ts";
import type { ContactIconsAndMap01Props } from "../src/marketing/contact-icons-and-map-01.ts";

describe("contact icons and map 01", () => {
  it("keeps contact actions controlled and the map explicitly named", () => {
    const props = {
      contactMethods: [
        {
          cta: "hi@siglata.com",
          href: "mailto:hi@siglata.com",
          icon: "mail",
          id: "email",
          subtitle: "Our friendly team is here to help.",
          title: "Email",
        },
      ],
      description: "Our friendly team would love to hear from you.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      mapSrc: "https://snazzymaps.com/embed/451894",
      mapTitle: "Our address",
      onContact: (id: string) => `contact:${id}`,
    } satisfies ContactIconsAndMap01Props<string>;

    expect(props.onContact("email")).toBe("contact:email");
    expect(props.mapTitle).toBe("Our address");
    expect(props.mapSrc).toContain("snazzymaps.com");
    expect(contactIconsAndMap01).toBeTypeOf("function");
  });
});
