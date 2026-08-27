/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { newsletterIphoneMockup01 } from "../../../src/marketing/newsletter-iphone-mockup-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("NewsletterIphoneMockup01Action");
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof newsletterIphoneMockup01<Message>>[1]) =>
    h.div([h.Class("-m-8")], [newsletterIphoneMockup01({ ...model, onAction: Actioned() }, h)]),
} as const;

const args = {
  ctaLabel: "Subscribe",
  description: "Join our newsletter to stay up to date on features and releases.",
  eyebrow: "Newsletter",
  heading: "Stay up to date",
} as const;

export default {
  ...componentMeta("newsletter-iphone-mockup-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Newsletter Cta/Newsletter Iphone Mockup 01",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof newsletterIphoneMockup01<Message>>[1]) =>
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
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading")).toHaveTextContent("Stay up to date");
    const cta = canvas.getByRole("button", { name: "Subscribe" });
    await userEvent.click(cta);
    await waitFor(() => expect(cta).toBeInTheDocument());
  },
};
