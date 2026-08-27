import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresCenterMockup01 } from "../src/marketing/features-center-mockup-01.ts";
import type { FeaturesCenterMockup01Props } from "../src/marketing/features-center-mockup-01.ts";

describe("features center mockup 01", () => {
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
    } satisfies FeaturesCenterMockup01Props<string>;

    expect(props.onItem?.("inboxes")).toBe("item:inboxes");
    expect(featuresCenterMockup01).toBeTypeOf("function");
  });
});
