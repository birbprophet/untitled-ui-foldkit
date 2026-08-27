/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerCountdownDefaultFullWidth } from "../../../../../packages/ui/src/marketing/banner-countdown-default-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Unit = S.Struct({ label: S.String, value: S.Number });
const Args = S.Struct({
  countdown: S.Tuple([Unit, Unit, Unit]),
  description: S.String,
  dismissLabel: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
const Dismissed = m("BannerCountdownDefaultFullWidthDismissed");
type Message = typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model): Model => ({ ...model, isVisible: false }),
  view: (model: Model, h: Parameters<typeof bannerCountdownDefaultFullWidth<Message>>[1]) =>
    model.isVisible
      ? bannerCountdownDefaultFullWidth({ ...model, onDismiss: Dismissed() }, h)
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  countdown: [
    { label: "hrs", value: 8 },
    { label: "mins", value: 16 },
    { label: "secs", value: 24 },
  ],
  description: "Lock in your annual plan today.",
  dismissLabel: "Dismiss",
  title: "30% off PRO ends soon",
} as const;

export default {
  ...componentMeta("banner-countdown-default-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Countdown Default Full Width",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: {
    ...args,
    countdown: [
      { label: "hrs", value: 0 },
      { label: "mins", value: 0 },
      { label: "secs", value: 1 },
    ],
  },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof bannerCountdownDefaultFullWidth<Message>>[1]) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary pt-16"), h.DataAttribute("theme", "dark")],
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
    await expect(canvas.getByText("8")).toBeInTheDocument();
    await expect(canvas.getByText("hrs")).toBeInTheDocument();
    const close = canvas.getByRole("button", { name: "Dismiss" });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
