import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresIconsAndImage01 } from "../src/marketing/features-icons-and-image-01.ts";
import type { FeaturesIconsAndImage01Props } from "../src/marketing/features-icons-and-image-01.ts";

describe("features icons and image 01", () => {
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
    } satisfies FeaturesIconsAndImage01Props<string>;

    expect(props.onItem?.("inboxes")).toBe("item:inboxes");
    expect(featuresIconsAndImage01).toBeTypeOf("function");
  });
});
