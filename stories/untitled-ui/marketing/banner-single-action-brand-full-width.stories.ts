/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerSingleActionBrandFullWidth } from "../../../src/marketing/banner-single-action-brand-full-width.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  actionHref: S.String,
  actionLabel: S.String,
  description: S.String,
  dismissLabel: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
const Action = m("BannerSingleActionBrandFullWidthAction");
const Dismissed = m("BannerSingleActionBrandFullWidthDismissed");
type Message = typeof Action.Type | typeof Dismissed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model, message: Message): Model =>
    message._tag === "BannerSingleActionBrandFullWidthDismissed"
      ? { ...model, isVisible: false }
      : { ...model, actionHref: "#update-opened" },
  view: (model: Model, h: Parameters<typeof bannerSingleActionBrandFullWidth<Message>>[1]) =>
    model.isVisible
      ? bannerSingleActionBrandFullWidth(
          { ...model, onAction: Action(), onDismiss: Dismissed() },
          h,
        )
      : h.div([h.AriaLabel("Banner dismissed")]),
} as const;

const args = {
  actionHref: "#update",
  actionLabel: "Read update",
  description: "Read about it from our CEO.",
  dismissLabel: "Dismiss",
  title: "We've just announced our Series A!",
} as const;

export default {
  ...componentMeta("banner-single-action-brand-full-width"),
  title: "Untitled UI/Marketing/Banners/Banner Single Action Brand Full Width",
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
    const action = await canvas.findByRole("link", { name: "Read update" });
    await expect(action).toHaveAttribute("href", "#update");
    await userEvent.click(action);
    await waitFor(async () => {
      await expect(canvas.getByRole("link", { name: args.actionLabel })).toHaveAttribute(
        "href",
        "#update-opened",
      );
    });
    const close = canvas.getByRole("button", { name: "Dismiss" });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument());
  },
};
