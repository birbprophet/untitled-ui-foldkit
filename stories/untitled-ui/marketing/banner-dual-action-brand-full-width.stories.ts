/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerDualActionBrandFullWidth } from "../../../src/marketing/banner-dual-action-brand-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  allowLabel: S.String,
  declineLabel: S.String,
  description: S.String,
  dismissLabel: S.String,
  policyHref: S.String,
  policyLabel: S.String,
  title: S.String,
});
const Model = S.Struct({
  ...Args.fields,
  choice: S.Union([S.Literal("none"), S.Literal("allowed"), S.Literal("declined")]),
  isVisible: S.Boolean,
});
type Model = typeof Model.Type;
const Allowed = m("BannerDualActionBrandFullWidthAllowed");
const Declined = m("BannerDualActionBrandFullWidthDeclined");
const Dismissed = m("BannerDualActionBrandFullWidthDismissed");
type Message = typeof Allowed.Type | typeof Declined.Type | typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, choice: "none", isVisible: true }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BannerDualActionBrandFullWidthDismissed") {
      return { ...model, isVisible: false };
    }
    if (message._tag === "BannerDualActionBrandFullWidthAllowed") {
      return { ...model, allowLabel: "Allowed", choice: "allowed" };
    }
    return { ...model, choice: "declined", declineLabel: "Declined" };
  },
  view: (model: Model, h: Parameters<typeof bannerDualActionBrandFullWidth<Message>>[1]) =>
    model.isVisible
      ? bannerDualActionBrandFullWidth(
          {
            ...model,
            onAllow: Allowed(),
            onDecline: Declined(),
            onDismiss: Dismissed(),
          },
          h,
        )
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  allowLabel: "Allow",
  declineLabel: "Decline",
  description: "Read our",
  dismissLabel: "Dismiss",
  policyHref: "#cookie-policy",
  policyLabel: "Cookie Policy",
  title: "We use third-party cookies in order to personalise your experience",
} as const;

export default {
  ...componentMeta("banner-dual-action-brand-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Dual Action Brand Full Width",
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
    await userEvent.click(canvas.getByRole("button", { name: "Allow" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Allowed" })).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Decline" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Declined" })).toBeInTheDocument(),
    );
    const close = canvas.getByRole("button", { name: "Dismiss" });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
