/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { newsletterIphoneMockup01 } from "../../../../../packages/ui/src/marketing/newsletter-iphone-mockup-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ description: S.String, heading: S.String });
const Model = Args;
type Model = typeof Model.Type;

const Action = m("NewsletterIphoneMockup01Action", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  view: (model: Model, h: Parameters<typeof newsletterIphoneMockup01<Message>>[1]) =>
    h.div([h.Class("-m-8")], [newsletterIphoneMockup01({ ...model, description: model.description, heading: model.heading, onAction: Action({ id: "action" }) }, h)]),
} as const;

const args = {
  description: "Everything you need to build modern UI and great products.",
  heading: "Build something great",
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
      h.div([h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };

export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const button = within(canvasElement).queryByRole("button");
    if (button !== null) {
      await userEvent.click(button);
      await waitFor(() => expect(button).toBeVisible());
    }
  },
};
