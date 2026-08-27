/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { headerSpaceBetweenButtonsBrand } from "../../../src/marketing/header-space-between-buttons-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
type Model = typeof Args.Type;
const Primary = m("HeaderSpaceBetweenButtonsBrandPrimary");
const Secondary = m("HeaderSpaceBetweenButtonsBrandSecondary");
type Message = typeof Primary.Type | typeof Secondary.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof headerSpaceBetweenButtonsBrand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        headerSpaceBetweenButtonsBrand(
          { ...model, onPrimary: Primary(), onSecondary: Secondary() },
          h,
        ),
      ],
    ),
} as const;

const args = {
  description: "Simple, transparent pricing that grows with you.",
  eyebrow: "Pricing",
  heading: "Plans that fit your scale",
  primaryLabel: "Get started",
  secondaryLabel: "Chat to sales",
} as const;

export default {
  ...componentMeta("header-space-between-buttons-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Space Between Buttons Brand",
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
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
  },
};
