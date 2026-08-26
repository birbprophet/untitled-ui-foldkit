import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSingleActionBrand } from "../src/marketing/banner-single-action-brand.ts";
import type { BannerSingleActionBrandProps } from "../src/marketing/banner-single-action-brand.ts";

describe("banner single action brand", () => {
  it("keeps exact copy, destination, action, and dismissal controlled", () => {
    const props: BannerSingleActionBrandProps<string> = {
      actionHref: "#update",
      actionLabel: "Read update",
      description: "Read about it from our CEO.",
      dismissLabel: "Dismiss",
      onAction: "action",
      onDismiss: "dismiss",
      title: "We've just announced our Series A!",
    };

    expect(props).toMatchObject({
      actionHref: "#update",
      actionLabel: "Read update",
      onAction: "action",
      onDismiss: "dismiss",
    });
    expect(typeof bannerSingleActionBrand).toBe("function");
  });
});
