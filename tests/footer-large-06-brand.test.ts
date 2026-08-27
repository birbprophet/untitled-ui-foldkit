import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { footerLarge06Brand } from "../src/marketing/footer-large-06-brand.ts";
import type { FooterLarge06BrandProps } from "../src/marketing/footer-large-06-brand.ts";

describe("footer large 06 brand", () => {
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
    } satisfies FooterLarge06BrandProps<string>;

    expect(props.onLink("overview")).toBe("link:overview");
    expect(props.onSocial("x")).toBe("social:x");
    expect(footerLarge06Brand).toBeTypeOf("function");
  });
});
