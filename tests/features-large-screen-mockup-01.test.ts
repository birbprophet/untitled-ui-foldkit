import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresLargeScreenMockup01 } from "../src/marketing/features-large-screen-mockup-01.ts";
import type { FeaturesLargeScreenMockup01Props } from "../src/marketing/features-large-screen-mockup-01.ts";

describe("features large screen mockup 01", () => {
  it("exports a FoldKit renderer", () => {
    const props = {
      description: "Powerful analytics.",
      eyebrow: "Features",
      heading: "Beautiful analytics to grow smarter",
      items: [
        {
          icon: "chat",
          id: "inboxes",
          subtitle: "Shared team inboxes keep everyone in the loop.",
          title: "Share team inboxes",
        },
      ],
      onItem: (itemId: string) => `item:${itemId}`,
    } satisfies FeaturesLargeScreenMockup01Props<string>;

    expect(props.onItem?.("inboxes")).toBe("item:inboxes");
    expect(featuresLargeScreenMockup01).toBeTypeOf("function");
  });
});
