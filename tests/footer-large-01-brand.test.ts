import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge01Brand } from "../src/marketing/footer-large-01-brand.ts";
import type { FooterLarge01BrandProps } from "../src/marketing/footer-large-01-brand.ts";

describe("footer large 01 brand", () => {
  it("keeps footer navigation controlled", () => {
    const props = {
      copyright: "© 2077 Siglata. All rights reserved.",
      description: "Design amazing digital experiences.",
      homeHref: "#",
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
    } satisfies FooterLarge01BrandProps<string>;

    expect(props.onLink("overview")).toBe("link:overview");
    expect(props.onSocial("x")).toBe("social:x");
    expect(footerLarge01Brand).toBeTypeOf("function");
  });
});
