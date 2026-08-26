import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerCountdownBrand } from "../src/marketing/banner-countdown-brand.ts";
import type { BannerCountdownBrandProps } from "../src/marketing/banner-countdown-brand.ts";

describe("banner countdown brand", () => {
  it("keeps the three countdown units and dismissal controlled", () => {
    const props = {
      countdown: [
        { label: "hrs", value: 8 },
        { label: "mins", value: 16 },
        { label: "secs", value: 24 },
      ],
      description: "Lock in your annual plan today.",
      dismissLabel: "Dismiss",
      onDismiss: "dismiss",
      title: "30% off PRO ends soon",
    } satisfies BannerCountdownBrandProps<string>;

    expect(props.countdown.map(({ label }) => label)).toEqual(["hrs", "mins", "secs"]);
    expect(props.countdown.map(({ value }) => value)).toEqual([8, 16, 24]);
    expect(props.onDismiss).toBe("dismiss");
    expect(bannerCountdownBrand).toBeTypeOf("function");
  });
});
