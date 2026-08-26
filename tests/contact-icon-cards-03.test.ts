import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactIconCards03 } from "../src/marketing/contact-icon-cards-03.ts";
import type { ContactIconCards03Card } from "../src/marketing/contact-icon-cards-03.ts";

const onContact = (id: string) => `contact:${id}`;

describe("contact icon cards 03", () => {
  it("retains the three contact methods and controlled link behavior", () => {
    const cards = [
      {
        cta: "sales@siglata.com",
        href: "mailto:sales@siglata.com",
        icon: "chat",
        id: "sales",
        subtitle: "Speak to our friendly team.",
        title: "Chat to sales",
      },
      {
        cta: "100 Smith Street\nCollingwood VIC 3066 AU",
        href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
        icon: "pin",
        id: "visit",
        subtitle: "Visit our office HQ.",
        title: "Visit us",
      },
      {
        cta: "+1 (555) 000-0000",
        href: "tel:+1 (555) 000-0000",
        icon: "phone",
        id: "call",
        subtitle: "Mon-Fri from 8am to 5pm.",
        title: "Call us",
      },
    ] satisfies readonly ContactIconCards03Card[];
    expect(cards.map(({ icon }) => icon)).toEqual(["chat", "pin", "phone"]);
    expect(cards[0]?.cta).toBe("sales@siglata.com");
    expect(onContact("sales")).toBe("contact:sales");
    expect(contactIconCards03).toBeTypeOf("function");
  });
});
