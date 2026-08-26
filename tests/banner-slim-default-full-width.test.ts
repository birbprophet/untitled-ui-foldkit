import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSlimDefaultFullWidth } from "../src/marketing/banner-slim-default-full-width.ts";
import type { BannerSlimDefaultFullWidthProps } from "../src/marketing/banner-slim-default-full-width.ts";

describe("bannerSlimDefaultFullWidth", () => {
  it("exposes source copy and controlled link and dismissal actions", () => {
    const props: BannerSlimDefaultFullWidthProps<"dismiss" | "link"> = {
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
    expect(bannerSlimDefaultFullWidth).toBeTypeOf("function");
  });
});
