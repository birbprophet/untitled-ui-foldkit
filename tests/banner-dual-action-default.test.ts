import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { bannerDualActionDefault } from "../src/marketing/banner-dual-action-default.ts";
import type { BannerDualActionDefaultProps } from "../src/marketing/banner-dual-action-default.ts";

describe("banner dual action default", () => {
  it("keeps consent, refusal, dismissal, and policy semantics distinct", () => {
    const props: BannerDualActionDefaultProps<string> = {
      allowLabel: "Allow",
      declineLabel: "Decline",
      dismissLabel: "Dismiss",
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      policyHref: "#cookie-policy",
      policyLabel: "Cookie Policy",
      policyPrefix: "Read our",
      title: "We use third-party cookies in order to personalise your experience",
    };

    expect(props).toMatchObject({
      onAllow: "allow",
      onDecline: "decline",
      onDismiss: "dismiss",
      policyHref: "#cookie-policy",
    });
    expect(props.onAllow).not.toBe(props.onDecline);
    expect(props.onDismiss).not.toBe(props.onAllow);
    expect(bannerDualActionDefault).toBeTypeOf("function");
  });
});
