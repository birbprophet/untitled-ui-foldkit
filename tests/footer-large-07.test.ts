import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge07 } from "../src/marketing/footer-large-07.ts";
import type { FooterLarge07Props } from "../src/marketing/footer-large-07.ts";

describe("footer large 07", () => {
  it("keeps footer navigation controlled", () => {
    const props = {
      copyright: "© 2077 Siglata. All rights reserved.",
      description: "Design amazing digital experiences.",
      homeHref: "#",
      logo: {
        mark: { alt: "Sample product symbol", src: "https://example.com/symbol.png" },
        text: "Sample product",
      },
      navGroups: [
        {
          id: "product",
          items: [{ href: "#overview", id: "overview", label: "Overview" }],
          label: "Product",
        },
      ],
      onHome: "home",
      onLink: (linkId: string) => `link:${linkId}`,
      onSocial: (socialId: string) => `social:${socialId}`,
      socials: [{ href: "https://x.com/", id: "x", label: "X" }],
    } satisfies FooterLarge07Props<string>;

    expect(props.onLink("overview")).toBe("link:overview");
    expect(props.onSocial("x")).toBe("social:x");
    expect(footerLarge07).toBeTypeOf("function");
  });
});
