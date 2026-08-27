/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, within } from "storybook/test";

import {
  contactIconsAndImageBrand,
  contactIconsAndImageBrandImageUrl,
  contactIconsAndImageBrandLocations,
} from "../../../src/marketing/contact-icons-and-image-brand.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({ address: S.String, id: S.String, title: S.String });
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageUrl: S.String,
  locations: S.Array(Location),
});
type Args = typeof Args.Type;
const Idle = m("ContactIconsAndImageBrandIdle", {});
type Message = typeof Idle.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, _message: Message): Args => model,
  view: (model: Args, h: Parameters<typeof contactIconsAndImageBrand<Message>>[1]) =>
    h.div([h.Class("-m-8")], [contactIconsAndImageBrand(model, h)]),
} as const;

const args = {
  description: "We'd love to hear from you! Please get in touch.",
  eyebrow: "Contact us",
  heading: "Chat to our friendly team",
  imageAlt: "Team discussing a topic",
  imageUrl: contactIconsAndImageBrandImageUrl,
  locations: [...contactIconsAndImageBrandLocations],
} satisfies Args;

export default {
  ...componentMeta("contact-icons-and-image-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Icons And Image Brand",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: args.heading })).toBeInTheDocument();
    await expect(canvas.getByAltText(args.imageAlt)).toHaveAttribute("src", args.imageUrl);
    await expect(canvas.getByRole("heading", { name: "Melbourne" })).toBeInTheDocument();
  },
};
