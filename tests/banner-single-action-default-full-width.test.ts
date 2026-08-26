import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSingleActionDefaultFullWidth } from "../src/marketing/banner-single-action-default-full-width.ts";
import type { BannerSingleActionDefaultFullWidthProps } from "../src/marketing/banner-single-action-default-full-width.ts";

describe("banner single action default full width", () => {
  it("keeps exact copy, destination, action, and dismissal controlled", () => {
    const props: BannerSingleActionDefaultFullWidthProps<string> = {
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
    expect(typeof bannerSingleActionDefaultFullWidth).toBe("function");
  });
});
