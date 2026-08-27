/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { ctaAbstractImages } from "../../../src/marketing/cta-abstract-images.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  ctaLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
});

const args = {
  ctaLabel: "Get started",
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  eyebrow: "Get started",
  heading: "Beautiful analytics to grow smarter",
};

export default {
  ...componentMeta("cta-abstract-images"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Cta/Cta Abstract Images",
};

export const AllVariants = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [ctaAbstractImages(props, h)])),
  args,
};
export const States = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [ctaAbstractImages(props, h)])),
  args,
};
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [ctaAbstractImages(props, h)],
    ),
  ),
  args,
};
export const Responsive = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [ctaAbstractImages(props, h)])),
  args,
};
export const Interactions = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [ctaAbstractImages(props, h)])),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2 })).toBeInTheDocument();
  },
};
