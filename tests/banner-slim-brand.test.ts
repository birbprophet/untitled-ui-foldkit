import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSlimBrand } from "../src/marketing/banner-slim-brand.ts";
import type { BannerSlimBrandProps } from "../src/marketing/banner-slim-brand.ts";

describe("banner slim brand", () => {
  it("keeps copy, destination, and dismissal controlled by the consuming model", () => {
    const props: BannerSlimBrandProps<"dismiss" | "link"> = {
      description: "Check out the",
      dismissLabel: "Dismiss",
      linkHref: "#dashboard",
      linkLabel: "new dashboard",
      onDismiss: "dismiss",
      onLink: "link",
      title: "We've just launched a new feature!",
    };

    expect(props.onDismiss).toBe("dismiss");
    expect(props.onLink).toBe("link");
    expect(props.linkHref).toBe("#dashboard");
    expect(props.dismissLabel).toBe("Dismiss");
    expect(typeof bannerSlimBrand).toBe("function");
  });
});
