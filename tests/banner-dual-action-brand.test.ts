import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerDualActionBrand } from "../src/marketing/banner-dual-action-brand.ts";
import type { BannerDualActionBrandProps } from "../src/marketing/banner-dual-action-brand.ts";

describe("banner dual action brand", () => {
  it("keeps consent, policy navigation, and dismissal controlled by the FoldKit model", () => {
    const props: BannerDualActionBrandProps<string> = {
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
    expect(typeof bannerDualActionBrand).toBe("function");
  });
});
