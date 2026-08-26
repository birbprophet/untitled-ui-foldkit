import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerDualActionDefaultFullWidth } from "../src/marketing/banner-dual-action-default-full-width.ts";
import type { BannerDualActionDefaultFullWidthProps } from "../src/marketing/banner-dual-action-default-full-width.ts";

describe("banner dual action default full width", () => {
  it("keeps policy navigation, both consent choices, and dismissal controlled", () => {
    const props: BannerDualActionDefaultFullWidthProps<string> = {
      allowLabel: "Allow",
      declineLabel: "Decline",
      dismissLabel: "Dismiss",
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      onPolicy: "policy",
      policyHref: "#cookie-policy",
      policyLabel: "Cookie Policy",
      policyPrefix: "Read our",
      title: "We use third-party cookies in order to personalise your experience",
    };

    expect(props).toMatchObject({
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      onPolicy: "policy",
      policyHref: "#cookie-policy",
    });
    expect(typeof bannerDualActionDefaultFullWidth).toBe("function");
  });
});
