/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { testimonialCard } from "../../../src/marketing/testimonial-card.ts";
import type { HtmlBuilder } from "foldkit/html";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  avatarAlt: S.String,
  category: S.String,
  name: S.String,
  quote: S.String,
  role: S.String,
});

type SectionArgs = typeof Args.Type;

const section = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div(
    [h.Class("-m-8")],
    [
      testimonialCard(
        {
          ...args,
          avatarSrc: `https://catalog.siglata.dev/avatar/agent-${encodeURIComponent(args.name)}?size=128`,
        },
        h,
      ),
    ],
  );

const darkSection = (args: SectionArgs, h: HtmlBuilder<{ readonly _tag: "Noop" }>) =>
  h.div(
    [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
    [section(args, h)],
  );

const args = {
  avatarAlt: "Fleur Cook",
  category: "Financial Services",
  name: "Fleur Cook",
  quote:
    "Siglata has saved us thousands of hours of work. We're able to spin up projects and features faster.",
  role: "Web Developer, Sisyphus",
} as const;

export default {
  ...componentMeta("testimonial-card"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Testimonials/Testimonial Card",
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
    await expect(canvas.getByText(args.category)).toBeTruthy();
  },
};
