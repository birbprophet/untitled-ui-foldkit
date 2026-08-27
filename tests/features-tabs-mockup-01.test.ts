import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresTabsMockup01 } from "../src/marketing/features-tabs-mockup-01.ts";
import type { FeaturesTabsMockup01Props } from "../src/marketing/features-tabs-mockup-01.ts";

describe("features tabs mockup 01", () => {
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
    } satisfies FeaturesTabsMockup01Props<string>;

    expect(props.onSelect("collaborate")).toBe("select:collaborate");
    expect(featuresTabsMockup01).toBeTypeOf("function");
  });
});
