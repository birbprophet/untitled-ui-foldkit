import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSingleActionDefault } from "../src/marketing/banner-single-action-default.ts";
import type { BannerSingleActionDefaultProps } from "../src/marketing/banner-single-action-default.ts";

describe("banner single action default", () => {
  it("keeps exact copy, destination, action, and dismissal controlled", () => {
    const props: BannerSingleActionDefaultProps<string> = {
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
    expect(typeof bannerSingleActionDefault).toBe("function");
  });
});
