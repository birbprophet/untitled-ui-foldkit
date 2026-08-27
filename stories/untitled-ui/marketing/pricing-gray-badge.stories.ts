/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { pricingGrayBadge } from "../../../../../packages/ui/src/marketing/pricing-gray-badge.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ description: S.String, heading: S.String });
const Model = Args;
type Model = typeof Model.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  view: (model: Model, h: Parameters<typeof pricingGrayBadge>[1]) =>
    h.div([h.Class("-m-8")], [pricingGrayBadge({ ...model, description: model.description, heading: model.heading }, h)]),
} as const;

const args = {
  description: "Everything you need to build modern UI and great products.",
  heading: "Build something great",
} as const;

export default {
  ...componentMeta("pricing-gray-badge"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Pricing Sections/Pricing Gray Badge",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof pricingGrayBadge>[1]) =>
      h.div([h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };

export const Interactions = { ...liveStory(definition), args };
