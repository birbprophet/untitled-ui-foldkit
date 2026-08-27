/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ctaIphoneMockup04 } from "../../../src/marketing/cta-iphone-mockup-04.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
type Model = typeof Args.Type;
const Action = m("CtaIphoneMockup04Action");
type Message = typeof Action.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof ctaIphoneMockup04<Message>>[1]) =>
    h.div([h.Class("-m-8")], [ctaIphoneMockup04({ ...model, onAction: Action() }, h)]),
} as const;

const args = {
  ctaLabel: "Get started",
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  eyebrow: "Get started",
  heading: "Beautiful analytics to grow smarter",
} as const;

export default {
  ...componentMeta("cta-iphone-mockup-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Cta/Cta Iphone Mockup 04",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
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
    const button = await within(canvasElement).findByRole("button", { name: /Get started/u });
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeVisible());
    button.blur();
  },
};
