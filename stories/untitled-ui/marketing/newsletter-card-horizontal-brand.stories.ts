/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { newsletterCardHorizontalBrand } from "../../../src/marketing/newsletter-card-horizontal-brand.ts";
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
  h.div([h.Class("-m-8")], [newsletterCardHorizontalBrand(args, h)]);

const darkSection = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div(
    [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
    [section(args, h)],
  );

const args = {
  ctaLabel: "Subscribe",
  description: "Join our newsletter to stay up to date on features and releases.",
  eyebrow: "Newsletter",
  heading: "Stay up to date",
} as const;

export default {
  ...componentMeta("newsletter-card-horizontal-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Newsletter Cta/Newsletter Card Horizontal Brand",
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
    await expect(canvas.getByRole("heading")).toHaveTextContent("Stay up to date");
  },
};
