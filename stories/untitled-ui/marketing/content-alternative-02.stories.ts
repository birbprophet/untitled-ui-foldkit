/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contentAlternative02 } from "../../../../../packages/ui/src/marketing/content-alternative-02.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ description: S.String,
  eyebrow: S.String,
  heading: S.String,
  images: S.Array(S.Struct({ alt: S.String, src: S.String })) });
type Args = typeof Args.Type;

const args = {
  description: "Maker & Co. are one of our favorite upcoming interior design studios.",
  eyebrow: "Published 13 Jan 2027",
  heading: "A conversation with Maker & Co.",
  images: [
    { alt: "Carousel image 1", src: "https://www.untitledui.com/marketing/content-carousel-01.webp" },
    { alt: "Carousel image 2", src: "https://www.untitledui.com/marketing/content-carousel-02.webp" },
  ],
} satisfies Args;

const specimen = (props: Args, h: Parameters<typeof contentAlternative02>[1]) =>
  h.div([h.Class("-m-8")], [contentAlternative02(props, h)]);

export default {
  ...componentMeta("content-alternative-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Alternative 02",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div([h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [contentAlternative02(props, h)]),
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
    await expect(canvas.getByRole("heading", { level: 1 })).toBeInTheDocument();
  },
};
