/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contentAlternative01 } from "../../../../../packages/ui/src/marketing/content-alternative-01.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ authorAvatarSrc: S.String,
  authorName: S.String,
  authorRole: S.String,
  badgeLabel: S.String,
  description: S.String,
  heading: S.String });
type Args = typeof Args.Type;

const args = {
  authorAvatarSrc: "https://www.untitledui.com/images/avatars/orlando-diggs?fm=webp&q=80",
  authorName: "Orlando Diggs",
  authorRole: "CX Lead, Layers",
  badgeLabel: "Customer Success",
  description: "Starting a community doesn't need to be complicated.",
  heading: "Podcast: Creating a better CX Community",
  
} satisfies Args;

const specimen = (props: Args, h: Parameters<typeof contentAlternative01>[1]) =>
  h.div([h.Class("-m-8")], [contentAlternative01(props, h)]);

export default {
  ...componentMeta("content-alternative-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Alternative 01",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div([h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [contentAlternative01(props, h)]),
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
