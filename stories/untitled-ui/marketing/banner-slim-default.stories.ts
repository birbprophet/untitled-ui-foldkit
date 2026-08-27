/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and the pointer/keyboard interaction use the browser promise API. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { bannerSlimDefault } from "../../../src/marketing/banner-slim-default.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  dismissLabel: S.String,
  linkHref: S.String,
  linkLabel: S.String,
  title: S.String,
});
const Model = S.Struct({ ...Args.fields, isVisible: S.Boolean });
type Model = typeof Model.Type;
const Dismissed = m("BannerSlimDefaultDismissed");
const LinkActivated = m("BannerSlimDefaultLinkActivated");
type Message = typeof Dismissed.Type | typeof LinkActivated.Type;
const dismissed = Dismissed();
const linkActivated = LinkActivated();

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model, message: Message): Model =>
    message._tag === "BannerSlimDefaultDismissed"
      ? { ...model, isVisible: false }
      : { ...model, linkHref: "#dashboard-opened" },
  view: (model: Model, h: Parameters<typeof bannerSlimDefault<Message>>[1]) => {
    if (model.isVisible) {
      return bannerSlimDefault({ ...model, onDismiss: dismissed, onLink: linkActivated }, h);
    }
    return h.div([h.AriaLabel("Banner dismissed")]);
  },
} as const;

const args = {
  description: "Check out the",
  dismissLabel: "Dismiss",
  linkHref: "#dashboard",
  linkLabel: "new dashboard",
  title: "We've just launched a new feature!",
} as const;

export default {
  ...componentMeta("banner-slim-default"),
  title: "Untitled UI/Marketing/Banners/Banner Slim Default",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary px-8 pt-16"), h.DataAttribute("theme", "dark")],
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
    const link = await canvas.findByRole("link", { name: args.linkLabel });
    await userEvent.click(link);
    await waitFor(async () => {
      await expect(canvas.getByRole("link", { name: args.linkLabel })).toHaveAttribute(
        "href",
        "#dashboard-opened",
      );
    });
    const close = await canvas.findByRole("button", { name: "Dismiss" });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(async () => {
      await expect(canvas.queryByText(args.title)).toBeNull();
      await expect(canvas.getByLabelText("Banner dismissed")).toBeInTheDocument();
    });
  },
};
