/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerDualActionDefault } from "../../../src/marketing/banner-dual-action-default.ts";
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
const Model = S.Struct({ ...Args.fields, decision: S.String, isVisible: S.Boolean });
type Model = typeof Model.Type;
const Allowed = m("BannerDualActionDefaultAllowed");
const Declined = m("BannerDualActionDefaultDeclined");
const Dismissed = m("BannerDualActionDefaultDismissed");
type Message = typeof Allowed.Type | typeof Declined.Type | typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, decision: "pending", isVisible: true }),
  update: (model: Model, message: Message): Model =>
    message._tag === "BannerDualActionDefaultDismissed"
      ? { ...model, isVisible: false }
      : {
          ...model,
          decision: message._tag === "BannerDualActionDefaultAllowed" ? "allowed" : "declined",
        },
  view: (model: Model, h: Parameters<typeof bannerDualActionDefault<Message>>[1]) =>
    model.isVisible
      ? h.div(
          [h.AriaLabel(`Cookie decision: ${model.decision}`)],
          [
            bannerDualActionDefault(
              { ...model, onAllow: Allowed(), onDecline: Declined(), onDismiss: Dismissed() },
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
  ...componentMeta("banner-dual-action-default"),
  title: "Untitled UI/Marketing/Banners/Banner Dual Action Default",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
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
    await expect(canvas.getByRole("link", { name: args.policyLabel })).toHaveAttribute(
      "href",
      args.policyHref,
    );
    await userEvent.click(canvas.getByRole("button", { name: args.declineLabel }));
    await waitFor(() =>
      expect(canvas.getByLabelText("Cookie decision: declined")).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("button", { name: args.allowLabel }));
    await waitFor(() =>
      expect(canvas.getByLabelText("Cookie decision: allowed")).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("button", { name: args.dismissLabel }));
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
