import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { featuresIntegrationsIcons03 } from "../src/marketing/features-integrations-icons-03.ts";
import type { FeaturesIntegrationsIcons03Props } from "../src/marketing/features-integrations-icons-03.ts";

describe("features integrations icons 03", () => {
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
    } satisfies FeaturesIntegrationsIcons03Props<string>;

    expect(props.onItem?.("inboxes")).toBe("item:inboxes");
    expect(featuresIntegrationsIcons03).toBeTypeOf("function");
  });
});
