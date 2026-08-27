/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the static FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, within } from "storybook/test";

import { contactCenteredMap } from "../../../../../packages/ui/src/marketing/contact-centered-map.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({ address: S.String, name: S.String });
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  leftLocations: S.Array(Location),
  mapSrc: S.String,
  mapTitle: S.String,
  rightLocations: S.Array(Location),
});
type Model = typeof Args.Type;
const Idle = m("ContactCenteredMapIdle", {});
type Message = typeof Idle.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof contactCenteredMap<Message>>[1]) =>
    contactCenteredMap(model, h),
} as const;

const args = {
  description: "Say hello to our friendly team at one of these locations.",
  eyebrow: "Our locations",
  heading: "Visit our stores",
  leftLocations: [
    { address: "100 Flinders Street\nMelbourne VIC 3000 AU", name: "Melbourne" },
    { address: "100 George Street\nSydney NSW 2000 AU", name: "Sydney" },
    { address: "100 Jonson Street\nByron Bay NSW 2481 AU", name: "Byron Bay" },
  ],
  mapSrc: "https://snazzymaps.com/embed/451894",
  mapTitle: "Our address",
  rightLocations: [
    { address: "100 Oxford Street\nLondon W1D 1LL UK", name: "London" },
    { address: "100 Market Street\nSan Francisco, CA 94105 USA", name: "San Francisco" },
    { address: "Drottninggatan 100\n111 60 Stockholm SE", name: "Sweden" },
  ],
} as const;

export default {
  ...componentMeta("contact-centered-map"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Centered Map",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    await expect(canvas.getByTitle(args.mapTitle)).toHaveAttribute("src", args.mapSrc);
    await expect(canvas.getByRole("heading", { name: "Melbourne" })).toBeInTheDocument();
    await expect(canvas.getByRole("heading", { name: "London" })).toBeInTheDocument();
  },
};
