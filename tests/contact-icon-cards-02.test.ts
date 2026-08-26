import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactIconCards02,
  contactIconCards02Cards,
} from "../src/marketing/contact-icon-cards-02.ts";
import type { ContactIconCards02Props } from "../src/marketing/contact-icon-cards-02.ts";

describe("contact icon cards 02", () => {
  it("preserves the authenticated card order and approved Siglata identity delta", () => {
    expect(contactIconCards02Cards.map(({ title }) => title)).toEqual([
      "Chat to sales",
      "Chat to support",
      "Visit us",
      "Call us",
    ]);
    expect(contactIconCards02Cards[0]?.href).toBe("mailto:sales@siglata.com");
    expect(contactIconCards02Cards[1]?.cta).toBe("support@siglata.com");
    expect(contactIconCards02Cards[2]?.cta).toContain("\n");
  });

  it("keeps every contact action controlled", () => {
    const props = {
      cards: contactIconCards02Cards,
      description: "Chat to our friendly team.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      onContact: (id: string) => `contact:${id}`,
    } satisfies ContactIconCards02Props<string>;

    expect(props.onContact("sales")).toBe("contact:sales");
    expect(props.onContact("office")).toBe("contact:office");
    expect(contactIconCards02).toBeTypeOf("function");
  });
});
