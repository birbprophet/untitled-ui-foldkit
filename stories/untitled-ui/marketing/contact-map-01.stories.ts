/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit location links in Chromium. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactMap01,
  contactMap01Locations,
  contactMap01MapSrc,
} from "../../../../../packages/ui/src/marketing/contact-map-01.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({
  address: S.String,
  href: S.String,
  id: S.String,
  schedule: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  locations: S.Array(Location),
  mapSrc: S.String,
  mapTitle: S.String,
});
type Args = typeof Args.Type;
type Message = Readonly<{ _tag: "LocationSelected"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, message: Message): Args => ({
    ...model,
    locations: model.locations.map((location) =>
      location.id === message.id ? { ...location, href: "#location-opened" } : location,
    ),
  }),
  view: (model: Args, h: Parameters<typeof contactMap01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactMap01(
          { ...model, onLocation: (id): Message => ({ _tag: "LocationSelected", id }) },
          h,
        ),
      ],
    ),
} as const;

const args = {
  description: "Come visit our friendly team at one of our offices.",
  eyebrow: "Contact us",
  heading: "Our locations",
  locations: [...contactMap01Locations],
  mapSrc: contactMap01MapSrc,
  mapTitle: "Our address",
} satisfies Args;

export default {
  ...componentMeta("contact-map-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Map 01",
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
    await expect(await canvas.findByTitle("Our address")).toBeInTheDocument();
    const location = await canvas.findByRole("link", {
      name: "150 Brunswick Street Fitzroy VIC 3065 AU",
    });
    location.focus();
    await expect(location).toHaveFocus();
    await userEvent.click(location);
    await waitFor(() => expect(location).toHaveAttribute("href", "#location-opened"));
    location.blur();
  },
};
