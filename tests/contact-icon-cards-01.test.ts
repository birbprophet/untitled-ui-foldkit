import { describe, it } from "@effect/vitest";

import {
  contactIconCards01,
  contactIconCards01Cards,
} from "../src/marketing/contact-icon-cards-01.ts";
import type { ContactIconCards01Props } from "../src/marketing/contact-icon-cards-01.ts";
import { expect } from "./assertions.ts";

describe("contact-icon-cards-01", () => {
  it("keeps every contact action controlled", () => {
    const props: ContactIconCards01Props<string> = {
      cards: contactIconCards01Cards,
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "We'd love to hear from you",
      onActivate: (id) => `activate:${id}`,
    };

    expect(props.onActivate("sales")).toBe("activate:sales");
    expect(props.onActivate("support")).toBe("activate:support");
    expect(typeof contactIconCards01).toBe("function");
  });

  it("preserves the four source cards, icon roles, and multiline office address", () => {
    expect(contactIconCards01Cards).toHaveLength(4);
    expect(contactIconCards01Cards.map(({ icon }) => icon)).toEqual([
      "smile",
      "chat",
      "location",
      "phone",
    ]);
    expect(contactIconCards01Cards[2]?.cta).toContain("\n");
    expect(new Set(contactIconCards01Cards.map(({ id }) => id)).size).toBe(4);
  });
});
