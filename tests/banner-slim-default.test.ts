import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerSlimDefault } from "../src/marketing/banner-slim-default.ts";
import type { BannerSlimDefaultProps } from "../src/marketing/banner-slim-default.ts";

describe("banner slim default", () => {
  it("keeps link activation and dismissal controlled by the consuming FoldKit model", () => {
    const props: BannerSlimDefaultProps<string> = {
      description: "Check out the",
      dismissLabel: "Dismiss",
      linkHref: "#dashboard",
      linkLabel: "new dashboard",
      onDismiss: "dismiss",
      onLink: "link",
      title: "We've just launched a new feature!",
    };

    expect(props.onDismiss).toBe("dismiss");
    expect(props.onLink).toBe("link");
    expect(props.dismissLabel).toBe("Dismiss");
    expect(typeof bannerSlimDefault).toBe("function");
  });
});
