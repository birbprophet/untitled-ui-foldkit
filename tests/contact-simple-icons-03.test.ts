import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactSimpleIcons03,
  contactSimpleIcons03Methods,
} from "../src/marketing/contact-simple-icons-03.ts";
import type { ContactSimpleIcons03Props } from "../src/marketing/contact-simple-icons-03.ts";

describe("contact simple icons 03", () => {
  it("preserves the authenticated method order and narrow Siglata name delta", () => {
    expect(contactSimpleIcons03Methods.map(({ title }) => title)).toEqual([
      "Email",
      "Office",
      "Phone",
    ]);
    expect(contactSimpleIcons03Methods[0]?.cta).toBe("hi@siglata.com");
    expect(contactSimpleIcons03Methods[1]?.cta).toContain("\n");
    expect(contactSimpleIcons03Methods[2]?.href).toBe("tel:+1 (555) 000-0000");
  });

  it("keeps all contact interactions controlled", () => {
    const props = {
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      methods: contactSimpleIcons03Methods,
      onContact: (id: string) => `contact:${id}`,
    } satisfies ContactSimpleIcons03Props<string>;

    expect(props.onContact("email")).toBe("contact:email");
    expect(props.onContact("office")).toBe("contact:office");
    expect(props.onContact("phone")).toBe("contact:phone");
    expect(contactSimpleIcons03).toBeTypeOf("function");
  });
});
