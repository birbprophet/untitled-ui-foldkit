/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, within } from "storybook/test";

import {
  contactIconsAndMap02,
  contactIconsAndMap02Locations,
} from "../../../../../packages/ui/src/marketing/contact-icons-and-map-02.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  locations: S.Array(S.Struct({ address: S.String, name: S.String })),
  mapSrc: S.String,
  mapTitle: S.String,
});
type Args = typeof Args.Type;

const story = staticStory(Args, (props: Args, h) =>
  h.div([h.Class("-m-8")], [contactIconsAndMap02(props, h)]),
);
const args = {
  description: "Come visit our friendly team at one of our offices.",
  eyebrow: "Contact us",
  heading: "Our locations",
  locations: [...contactIconsAndMap02Locations],
  mapSrc: "https://snazzymaps.com/embed/451871",
  mapTitle: "Our address",
} satisfies Args;

export default {
  ...componentMeta("contact-icons-and-map-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Map 02",
};

export const AllVariants = { ...story, args };
export const States = { ...story, args };
export const Dark = {
  ...staticStory(Args, (props: Args, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contactIconsAndMap02(props, h)],
    ),
  ),
  args,
};
export const Responsive = { ...story, args };
export const Interactions = {
  ...story,
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Melbourne" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Sydney" })).toBeVisible();
    const map = canvas.getByTitle("Our address");
    await userEvent.click(map);
    map.focus();
    await expect(map).toHaveFocus();
    await expect(map).toHaveAttribute("src", "https://snazzymaps.com/embed/451871");
  },
};
