import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactSimpleIcons01 } from "../src/marketing/contact-simple-icons-01.ts";
import type { ContactSimpleIcons01Props } from "../src/marketing/contact-simple-icons-01.ts";

describe("contact simple icons 01", () => {
  it("keeps each contact destination and action explicit", () => {
    const props: ContactSimpleIcons01Props<string> = {
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
    expect(props.items[0]?.href).toBe("mailto:hi@untitledui.com");
    expect(props.items[1]?.href).toBe("tel:+1 (555) 000-0000");
    expect(props.onContact("email")).toBe("contact:email");
    expect(contactSimpleIcons01).toBeTypeOf("function");
  });
});
