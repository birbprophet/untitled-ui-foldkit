import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { header } from "../src/marketing/header.ts";
import type { HeaderProps } from "../src/marketing/header.ts";

describe("header", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {
      brand: {
        mark: { alt: "Siglata mark", src: "https://www.untitledui.com/mark.png" },
        text: "Siglata",
      },
      footerLinks: [{ href: "#", id: "privacy", label: "Privacy" }],
      isMobileOpen: false,
      items: [{ hasMenu: true, href: "#", id: "product", label: "Product" }],
      mobileExpandedItemId: null,
      onFooterLink: (id) => `footer:${id}`,
      onItem: (id) => `nav:${id}`,
      onLogin: "login",
      onMenuToggle: (id) => `toggle:${id}`,
      onMobileClose: "mobile-close",
      onMobileExpand: (id) => `expand:${id}`,
      onMobileOpen: "mobile-open",
      onSignup: "signup",
      openMenuId: null,
    } satisfies HeaderProps<string>;
    expect(header).toBeTypeOf("function");
    expect(props.onItem("pricing")).toBe("nav:pricing");
  });
});
