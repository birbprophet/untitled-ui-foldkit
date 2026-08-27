/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { testimonialSocialCards02Brand } from "../../../src/marketing/testimonial-social-cards-02-brand.ts";
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
  h.div([h.Class("-m-8")], [testimonialSocialCards02Brand(args, h)]);

const darkSection = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div(
    [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
    [section(args, h)],
  );

const args = {
  ctaLabel: "Read customer stories",
  description: "Hear how teams of every size ship faster with Siglata.",
  eyebrow: "Testimonials",
  heading: "Loved by teams worldwide",
} as const;

export default {
  ...componentMeta("testimonial-social-cards-02-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Testimonials/Testimonial Social Cards 02 Brand",
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
    await expect(canvas.getByRole("heading")).toHaveTextContent("Loved by teams worldwide");
  },
};
