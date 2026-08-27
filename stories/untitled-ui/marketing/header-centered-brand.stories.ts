/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { headerCenteredBrand } from "../../../src/marketing/header-centered-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
type Model = typeof Args.Type;
type Message = never;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof headerCenteredBrand<Message>>[1]) =>
    h.div([h.Class("-m-8")], [headerCenteredBrand({ ...model }, h)]),
} as const;

const args = {
  description: "Learn more about the company and the world-class team behind Siglata.",
  eyebrow: "About us",
  heading: "About the company",
} as const;

export default {
  ...componentMeta("header-centered-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Centered Brand",
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
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toBeInTheDocument();
  },
};
