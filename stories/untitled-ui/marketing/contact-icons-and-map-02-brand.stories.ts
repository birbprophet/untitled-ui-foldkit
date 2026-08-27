/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, userEvent, within } from "storybook/test";

import {
  contactIconsAndMap02Brand,
  contactIconsAndMap02BrandLocations,
  contactIconsAndMap02BrandMap,
} from "../../../../../packages/ui/src/marketing/contact-icons-and-map-02-brand.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({ id: S.String, subtitle: S.String, title: S.String });
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  locations: S.Array(Location),
  mapSrc: S.String,
  mapTitle: S.String,
});

const args = {
  description: "Come visit our friendly team at one of our offices.",
  eyebrow: "Contact us",
  heading: "Our locations",
  locations: [...contactIconsAndMap02BrandLocations],
  mapSrc: contactIconsAndMap02BrandMap.src,
  mapTitle: contactIconsAndMap02BrandMap.title,
} satisfies typeof Args.Type;

const specimen = (
  props: typeof Args.Type,
  h: Parameters<typeof contactIconsAndMap02Brand<{ readonly _tag: "Noop" }>>[1],
) => h.div([h.Class("-m-8")], [contactIconsAndMap02Brand(props, h)]);

export default {
  ...componentMeta("contact-icons-and-map-02-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Map 02 Brand",
};

export const AllVariants = { ...staticStory(Args, specimen), args };
export const States = { ...staticStory(Args, specimen), args };
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contactIconsAndMap02Brand(props, h)],
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
    await expect(canvas.getByRole("heading", { name: "Melbourne" })).toBeVisible();
    const map = canvas.getByTitle(args.mapTitle);
    await userEvent.click(map);
    map.focus();
    await expect(map).toHaveFocus();
    await expect(map).toHaveAttribute("src", args.mapSrc);
  },
};
