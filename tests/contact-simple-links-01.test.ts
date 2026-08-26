import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactSimpleLinks01 } from "../src/marketing/contact-simple-links-01.ts";
import type { ContactSimpleLinks01Props } from "../src/marketing/contact-simple-links-01.ts";

describe("contact simple links 01", () => {
  it("keeps header copy, destinations, and contact actions explicit", () => {
    const props: ContactSimpleLinks01Props<string> = {
      description: "Our friendly team is always here to chat.",
      eyebrow: "Contact us",
      heading: "We'd love to hear from you",
      items: [
        {
          cta: "hi@untitledui.com",
          href: "mailto:hi@untitledui.com",
          icon: "email",
          id: "email",
          subtitle: "Our friendly team is here to help.",
          title: "Email",
        },
        {
          cta: "+1 (555) 000-0000",
          href: "tel:+1 (555) 000-0000",
          icon: "phone",
          id: "phone",
          subtitle: "Mon-Fri from 8am to 5pm.",
          title: "Phone",
        },
      ],
      onContact: (id) => `contact:${id}`,
    };
    expect(props.heading).toBe("We'd love to hear from you");
    expect(props.items[0]?.href).toBe("mailto:hi@untitledui.com");
    expect(props.items[1]?.href).toBe("tel:+1 (555) 000-0000");
    expect(props.onContact("office")).toBe("contact:office");
    expect(contactSimpleLinks01).toBeTypeOf("function");
  });
});
