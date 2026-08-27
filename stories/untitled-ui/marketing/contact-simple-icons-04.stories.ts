/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import { contactSimpleIcons04,contactSimpleIcons04Locations } from "../../../../../packages/ui/src/marketing/contact-simple-icons-04.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  locations: S.Array(S.Struct({ address: S.String, name: S.String })),
});
type Args = typeof Args.Type;


const args = {
  description: "Find us at these locations.",
  eyebrow: "Our locations",
  heading: "Visit our stores",
  locations: [...contactSimpleIcons04Locations],
} satisfies Args;

const specimen = (props: Args, h: Parameters<typeof contactSimpleIcons04>[1]) =>
  h.div([h.Class("-m-8")], [contactSimpleIcons04(props, h)]);

export default {
  ...componentMeta("contact-simple-icons-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Icons 04",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contactSimpleIcons04(props, h)],
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
