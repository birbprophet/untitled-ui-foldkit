/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { metricsSimpleWithActions02 } from "../../../src/marketing/metrics-simple-with-actions-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("MetricsSimpleWithActions02Action");
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof metricsSimpleWithActions02<Message>>[1]) =>
    h.div([h.Class("-m-8")], [metricsSimpleWithActions02({ ...model, onAction: Actioned() }, h)]),
} as const;

const args = {
  ctaLabel: "Learn more",
  description: "Understand how your team uses Siglata with clear, actionable insights.",
  eyebrow: "Analytics",
  heading: "Metrics that move the needle",
} as const;

export default {
  ...componentMeta("metrics-simple-with-actions-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Metrics/Metrics Simple With Actions 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof metricsSimpleWithActions02<Message>>[1]) =>
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
    await expect(canvas.getByRole("heading")).toHaveTextContent("Metrics that move the needle");
    const cta = canvas.getByRole("button", { name: "Learn more" });
    await userEvent.click(cta);
    await waitFor(() => expect(cta).toBeInTheDocument());
  },
};
