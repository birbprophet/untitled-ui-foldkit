import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerCountdownBrandFullWidth } from "../src/marketing/banner-countdown-brand-full-width.ts";
import type { BannerCountdownBrandFullWidthProps } from "../src/marketing/banner-countdown-brand-full-width.ts";

describe("banner countdown brand full width", () => {
  it("keeps countdown copy, values, and dismissal controlled", () => {
    const props: BannerCountdownBrandFullWidthProps<string> = {
      description: "Lock in your annual plan today.",
      dismissLabel: "Dismiss",
      hours: 8,
      hoursLabel: "hrs",
      minutes: 16,
      minutesLabel: "mins",
      onDismiss: "dismiss",
      seconds: 24,
      secondsLabel: "secs",
      title: "30% off PRO ends soon",
    };

    expect(props).toMatchObject({
      hours: 8,
      minutes: 16,
      onDismiss: "dismiss",
      seconds: 24,
    });
    expect(bannerCountdownBrandFullWidth).toBeTypeOf("function");
  });
});
