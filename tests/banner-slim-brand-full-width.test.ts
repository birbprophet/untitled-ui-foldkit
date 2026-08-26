import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSlimBrandFullWidth } from "../src/marketing/banner-slim-brand-full-width.ts";
import type { BannerSlimBrandFullWidthProps } from "../src/marketing/banner-slim-brand-full-width.ts";

describe("bannerSlimBrandFullWidth", () => {
  it("exposes source copy and controlled link and dismissal actions", () => {
    const props: BannerSlimBrandFullWidthProps<"dismiss" | "link"> = {
      description: "Check out the",
      dismissLabel: "Dismiss",
      linkHref: "#dashboard",
      linkLabel: "new dashboard",
      onDismiss: "dismiss",
      onLink: "link",
      title: "We've just launched a new feature!",
    };

    expect(props).toMatchObject({
      linkHref: "#dashboard",
      onDismiss: "dismiss",
      onLink: "link",
    });
    expect(bannerSlimBrandFullWidth).toBeTypeOf("function");
  });
});
