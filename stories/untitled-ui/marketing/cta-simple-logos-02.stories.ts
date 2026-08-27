/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises FoldKit in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ctaSimpleLogos02 } from "../../../src/marketing/cta-simple-logos-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  heading: S.String,
  primaryLabel: S.String,
  secondaryLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;
const Primary = m("CtaSimpleLogos02Primary");
const Secondary = m("CtaSimpleLogos02Secondary");
type Message = typeof Primary.Type | typeof Secondary.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args }),
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof ctaSimpleLogos02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [ctaSimpleLogos02({ ...model, onPrimary: Primary(), onSecondary: Secondary() }, h)],
    ),
} as const;

const args = {
  description: "Join over 4,000+ startups already growing with Untitled.",
  heading: "Start your free trial",
  primaryLabel: "Get started",
  secondaryLabel: "Learn more",
} as const;

export default {
  ...componentMeta("cta-simple-logos-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Cta/Cta Simple Logos 02",
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
    const primary = await canvas.findByRole("button", { name: /Get started/u });
    await userEvent.click(primary);
    await waitFor(() => expect(primary).toBeInTheDocument());
  },
};
