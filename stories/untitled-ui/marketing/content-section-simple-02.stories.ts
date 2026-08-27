/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contentSectionSimple02 } from "../../../src/marketing/content-section-simple-02.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
type Args = typeof Args.Type;

const args = {} satisfies Args;

const specimen = (
  props: Args,
  h: Parameters<typeof contentSectionSimple02<{ readonly _tag: "Noop" }>>[1],
) => h.div([h.Class("-m-8")], [contentSectionSimple02(props, h)]);

export default {
  ...componentMeta("content-section-simple-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Section Simple 02",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contentSectionSimple02(props, h)],
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
