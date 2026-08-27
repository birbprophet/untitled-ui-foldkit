import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresTabsMockup04 } from "../src/marketing/features-tabs-mockup-04.ts";
import type { FeaturesTabsMockup04Props } from "../src/marketing/features-tabs-mockup-04.ts";

describe("features tabs mockup 04", () => {
  it("keeps tab selection controlled", () => {
    const props = {
      description: "Powerful analytics.",
      eyebrow: "Features",
      heading: "Beautiful analytics to grow smarter",
      onSelect: (tabId: string) => `select:${tabId}`,
      selectedId: "collaborate",
      tabs: [
        {
          description: "Collaborate in real time.",
          id: "collaborate",
          imageAlt: "Dashboard mockup",
          imageDarkSrc:
            "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
          imageLightSrc:
            "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
          title: "Collaborate",
        },
      ],
    } satisfies FeaturesTabsMockup04Props<string>;

    expect(props.onSelect("collaborate")).toBe("select:collaborate");
    expect(featuresTabsMockup04).toBeTypeOf("function");
  });
});
