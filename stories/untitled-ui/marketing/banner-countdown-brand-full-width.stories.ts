/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerCountdownBrandFullWidth } from "../../../src/marketing/banner-countdown-brand-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  dismissLabel: S.String,
  hours: S.Number,
  hoursLabel: S.String,
  minutes: S.Number,
  minutesLabel: S.String,
  seconds: S.Number,
  secondsLabel: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
const Dismissed = m("BannerCountdownBrandFullWidthDismissed");
type Message = typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model): Model => ({ ...model, isVisible: false }),
  view: (model: Model, h: Parameters<typeof bannerCountdownBrandFullWidth<Message>>[1]) =>
    model.isVisible
      ? bannerCountdownBrandFullWidth({ ...model, onDismiss: Dismissed() }, h)
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  description: "Lock in your annual plan today.",
  dismissLabel: "Dismiss",
  hours: 8,
  hoursLabel: "hrs",
  minutes: 16,
  minutesLabel: "mins",
  seconds: 24,
  secondsLabel: "secs",
  title: "30% off PRO ends soon",
} as const;

export default {
  ...componentMeta("banner-countdown-brand-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Countdown Brand Full Width",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, hours: 0, minutes: 0, seconds: 9 },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary px-8 pt-16 pb-8"), h.DataAttribute("theme", "dark")],
        [
          model.isVisible
            ? bannerCountdownBrandFullWidth({ ...model, onDismiss: Dismissed() }, h)
            : h.div([h.AriaLabel("Banner dismissed")]),
        ],
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
    const close = await canvas.findByRole("button", { name: args.dismissLabel });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
