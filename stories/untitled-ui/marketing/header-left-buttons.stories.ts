/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { headerLeftButtons } from "../../../src/marketing/header-left-buttons.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
type Model = typeof Args.Type;
const Primary = m("HeaderLeftButtonsPrimary");
const Secondary = m("HeaderLeftButtonsSecondary");
type Message = typeof Primary.Type | typeof Secondary.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof headerLeftButtons<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [headerLeftButtons({ ...model, onPrimary: Primary(), onSecondary: Secondary() }, h)],
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
  ...componentMeta("header-left-buttons"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Left Buttons",
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
