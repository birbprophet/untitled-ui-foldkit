import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactSimpleIcons02 } from "../src/marketing/contact-simple-icons-02.ts";
import type { ContactSimpleIcons02Props } from "../src/marketing/contact-simple-icons-02.ts";

describe("contact simple icons 02", () => {
  it("keeps each semantic contact action controlled", () => {
    const props = {
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "Get in touch",
      methods: [
        {
          cta: "hi@siglata.com",
          href: "mailto:hi@siglata.com",
          icon: "mail",
          id: "email",
          subtitle: "Our friendly team is here to help.",
          title: "Email",
        },
      ],
      onContact: (id: string) => `contact:${id}`,
    } satisfies ContactSimpleIcons02Props<string>;

    expect(props.onContact("email")).toBe("contact:email");
    expect(props.methods[0]?.href).toBe("mailto:hi@siglata.com");
    expect(contactSimpleIcons02).toBeTypeOf("function");
  });
});
