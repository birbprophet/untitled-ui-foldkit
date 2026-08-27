/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { pricingSectionFeaturedCards03 } from "../../../../../packages/ui/src/marketing/pricing-section-featured-cards-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ description: S.String, heading: S.String });
const Model = Args;
type Model = typeof Model.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  view: (model: Model, h: Parameters<typeof pricingSectionFeaturedCards03>[1]) =>
    h.div([h.Class("-m-8")], [pricingSectionFeaturedCards03({ ...model, description: model.description, heading: model.heading }, h)]),
} as const;

const args = {
  description: "Everything you need to build modern UI and great products.",
  heading: "Build something great",
} as const;

export default {
  ...componentMeta("pricing-section-featured-cards-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Pricing Sections/Pricing Section Featured Cards 03",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof pricingSectionFeaturedCards03>[1]) =>
      h.div([h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };

export const Interactions = { ...liveStory(definition), args };
