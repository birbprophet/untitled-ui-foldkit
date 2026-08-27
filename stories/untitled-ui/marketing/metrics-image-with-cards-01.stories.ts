/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { metricsImageWithCards01 } from "../../../src/marketing/metrics-image-with-cards-01.ts";
import type { HtmlBuilder } from "foldkit/html";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});

type SectionArgs = typeof Args.Type;

const section = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div([h.Class("-m-8")], [metricsImageWithCards01(args, h)]);

const darkSection = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div(
    [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
    [section(args, h)],
  );

const args = {
  ctaLabel: "Learn more",
  description: "Understand how your team uses Siglata with clear, actionable insights.",
  eyebrow: "Analytics",
  heading: "Metrics that move the needle",
} as const;

export default {
  ...componentMeta("metrics-image-with-cards-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Metrics/Metrics Image With Cards 01",
};

export const AllVariants = { ...staticStory(Args, section), args };
export const States = { ...staticStory(Args, section), args };
export const Dark = { ...staticStory(Args, darkSection), args };
export const Responsive = { ...staticStory(Args, section), args };

export const Interactions = {
  ...staticStory(Args, section),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading")).toHaveTextContent("Metrics that move the needle");
  },
};
