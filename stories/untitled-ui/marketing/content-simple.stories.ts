/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contentSimple } from "../../../src/marketing/content-simple.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});
type Args = typeof Args.Type;

const args = {
  ctaLabel: "Get started",
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  eyebrow: "Get started",
  heading: "Beautiful analytics to grow smarter",
};

const specimen = (props: Args, h: Parameters<typeof contentSimple<{ readonly _tag: "Noop" }>>[1]) =>
  h.div([h.Class("-m-8")], [contentSimple(props, h)]);

export default {
  ...componentMeta("content-simple"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Simple",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contentSimple(props, h)],
    ),
  ),
  args,
};
export const Responsive = { ...staticStory(Args, specimen), args };
export const Interactions = {
  ...staticStory(Args, specimen),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2 })).toBeInTheDocument();
  },
};
