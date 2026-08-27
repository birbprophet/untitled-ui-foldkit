/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contentAlternative03 } from "../../../../../packages/ui/src/marketing/content-alternative-03.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({ authorAvatarSrc: S.String,
  authorName: S.String,
  authorRole: S.String,
  description: S.String,
  heading: S.String,
  heroAlt: S.String,
  heroSrc: S.String });
type Args = typeof Args.Type;

const args = {
  authorAvatarSrc: "https://www.untitledui.com/images/avatars/orlando-diggs?fm=webp&q=80",
  authorName: "Olivia Rhye",
  authorRole: "Published in Adventure",
  
  description: "New Zealand is famous for its breathtaking hiking trails.",
  heading: "Roy's Peak Wanaka, New Zealand",
  heroAlt: "Mountains", heroSrc: "https://www.untitledui.com/marketing/mountains-2.webp",
} satisfies Args;

const specimen = (props: Args, h: Parameters<typeof contentAlternative03>[1]) =>
  h.div([h.Class("-m-8")], [contentAlternative03(props, h)]);

export default {
  ...componentMeta("content-alternative-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Content/Content Alternative 03",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div([h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [contentAlternative03(props, h)]),
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
