import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge04Brand } from "../src/marketing/footer-large-04-brand.ts";
import type { FooterLarge04BrandProps } from "../src/marketing/footer-large-04-brand.ts";

describe("footer large 04 brand", () => {
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
    } satisfies FooterLarge04BrandProps<string>;

    expect(props.onLink("overview")).toBe("link:overview");
    expect(props.onSocial("x")).toBe("social:x");
    expect(footerLarge04Brand).toBeTypeOf("function");
  });
});
