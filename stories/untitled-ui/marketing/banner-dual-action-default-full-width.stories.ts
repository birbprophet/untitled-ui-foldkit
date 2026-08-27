/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerDualActionDefaultFullWidth } from "../../../src/marketing/banner-dual-action-default-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  allowLabel: S.String,
  declineLabel: S.String,
  dismissLabel: S.String,
  policyHref: S.String,
  policyLabel: S.String,
  policyPrefix: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean, selection: S.String });
type Model = typeof Model.Type;
const Allow = m("BannerDualActionDefaultFullWidthAllowed");
const Decline = m("BannerDualActionDefaultFullWidthDeclined");
const Dismiss = m("BannerDualActionDefaultFullWidthDismissed");
const Policy = m("BannerDualActionDefaultFullWidthPolicyOpened");
type Message = typeof Allow.Type | typeof Decline.Type | typeof Dismiss.Type | typeof Policy.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true, selection: "none" }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BannerDualActionDefaultFullWidthAllowed") {
      return { ...model, selection: "allowed" };
    }
    if (message._tag === "BannerDualActionDefaultFullWidthDeclined") {
      return { ...model, selection: "declined" };
    }
    if (message._tag === "BannerDualActionDefaultFullWidthDismissed") {
      return { ...model, isVisible: false };
    }
    return { ...model, policyHref: "#cookie-policy-opened" };
  },
  view: (model: Model, h: Parameters<typeof bannerDualActionDefaultFullWidth<Message>>[1]) =>
    model.isVisible
      ? h.div(
          [h.DataAttribute("selection", model.selection)],
          [
            bannerDualActionDefaultFullWidth(
              {
                ...model,
                onAllow: Allow(),
                onDecline: Decline(),
                onDismiss: Dismiss(),
                onPolicy: Policy(),
              },
              h,
            ),
          ],
        )
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  allowLabel: "Allow",
  declineLabel: "Decline",
  dismissLabel: "Dismiss",
  policyHref: "#cookie-policy",
  policyLabel: "Cookie Policy",
  policyPrefix: "Read our",
  title: "We use third-party cookies in order to personalise your experience",
} as const;

export default {
  ...componentMeta("banner-dual-action-default-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Dual Action Default Full Width",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary px-8 pt-16 pb-8"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const policy = await canvas.findByRole("link", { name: "Cookie Policy" });
    await expect(policy).toHaveAttribute("href", "#cookie-policy");
    await userEvent.click(policy);
    await waitFor(() => expect(policy).toHaveAttribute("href", "#cookie-policy-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "Decline" }));
    await waitFor(() =>
      expect(policy.closest("[data-selection]")).toHaveAttribute("data-selection", "declined"),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Allow" }));
    await waitFor(() =>
      expect(policy.closest("[data-selection]")).toHaveAttribute("data-selection", "allowed"),
    );
    const close = canvas.getByRole("button", { name: "Dismiss" });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
