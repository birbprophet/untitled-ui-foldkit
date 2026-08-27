/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, within } from "storybook/test";

import {
  contactIconsAndImage,
  contactIconsAndImageImage,
  contactIconsAndImageLocations,
} from "../../../src/marketing/contact-icons-and-image.ts";
import { componentMeta, staticStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({ id: S.String, subtitle: S.String, title: S.String });
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
  locations: S.Array(Location),
});

const args = {
  description: "We'd love to hear from you! Please get in touch.",
  eyebrow: "Contact us",
  heading: "Chat to our friendly team",
  imageAlt: contactIconsAndImageImage.alt,
  imageSrc: contactIconsAndImageImage.src,
  locations: [...contactIconsAndImageLocations],
} satisfies typeof Args.Type;

export default {
  ...componentMeta("contact-icons-and-image"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Image",
};

export const AllVariants = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [contactIconsAndImage(props, h)])),
  args,
};
export const States = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [contactIconsAndImage(props, h)])),
  args,
};
export const Dark = {
  ...staticStory(Args, (props, h) =>
    h.div(
      [h.Class("-m-8 min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
      [contactIconsAndImage(props, h)],
    ),
  ),
  args,
};
export const Responsive = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [contactIconsAndImage(props, h)])),
  args,
};
export const Interactions = {
  ...staticStory(Args, (props, h) => h.div([h.Class("-m-8")], [contactIconsAndImage(props, h)])),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: args.heading })).toBeInTheDocument();
    await expect(canvas.getByAltText(args.imageAlt)).toHaveAttribute("src", args.imageSrc);
    await expect(canvas.getByRole("heading", { name: "Melbourne" })).toBeInTheDocument();
  },
};
