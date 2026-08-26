import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerDualActionBrandFullWidth } from "../src/marketing/banner-dual-action-brand-full-width.ts";
import type { BannerDualActionBrandFullWidthProps } from "../src/marketing/banner-dual-action-brand-full-width.ts";

describe("banner dual action brand full width", () => {
  it("keeps policy, consent actions, and dismissal controlled", () => {
    const props: BannerDualActionBrandFullWidthProps<"allow" | "decline" | "dismiss"> = {
      allowLabel: "Allow",
      declineLabel: "Decline",
      description: "Read our",
      dismissLabel: "Dismiss",
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      policyHref: "#cookie-policy",
      policyLabel: "Cookie Policy",
      title: "We use third-party cookies in order to personalise your experience",
    };

    expect(props).toMatchObject({
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      policyHref: "#cookie-policy",
    });
    expect(props.dismissLabel).toBe("Dismiss");
    expect(bannerDualActionBrandFullWidth).toBeTypeOf("function");
  });
});
