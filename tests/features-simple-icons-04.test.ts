import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresSimpleIcons04 } from "../src/marketing/features-simple-icons-04.ts";
import type { FeaturesSimpleIcons04Props } from "../src/marketing/features-simple-icons-04.ts";

describe("features simple icons 04", () => {
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
    } satisfies FeaturesSimpleIcons04Props<string>;

    expect(props.onItem?.("inboxes")).toBe("item:inboxes");
    expect(featuresSimpleIcons04).toBeTypeOf("function");
  });
});
