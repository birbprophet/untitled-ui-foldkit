/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/prefer-destructuring, mps/avoid-direct-tag-checks -- Storybook exercises controlled tab and link behavior in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactFeaturesTabsMap02 } from "../../../src/marketing/contact-features-tabs-map-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({
  address: S.String,
  ctaLabel: S.String,
  href: S.String,
  id: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  locations: S.Array(Location),
  mapTitle: S.String,
  mapUrl: S.String,
});
const Model = S.Struct({ ...Args.fields, selectedLocationId: S.String });
type Model = typeof Model.Type;
const Selected = m("ContactFeaturesTabsMap02Selected", { id: S.String });
const Viewed = m("ContactFeaturesTabsMap02Viewed", { id: S.String });
type Message = typeof Selected.Type | typeof Viewed.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    selectedLocationId: args.locations[0]?.id ?? "",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ContactFeaturesTabsMap02Selected") {
      return { ...model, selectedLocationId: message.id };
    }
    return {
      ...model,
      locations: model.locations.map((location) =>
        location.id === message.id ? { ...location, href: "#store-opened" } : location,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof contactFeaturesTabsMap02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        contactFeaturesTabsMap02(
          {
            ...model,
            onLocationSelect: (id) => Selected({ id }),
            onViewLocation: (id) => Viewed({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const locations = [
  {
    address: "100 Flinders Street\nMelbourne VIC 3000 AU",
    ctaLabel: "View store",
    href: "#melbourne",
    id: "melbourne",
    title: "Melbourne",
  },
  {
    address: "100 George Street\nSydney NSW 2000 AU",
    ctaLabel: "View store",
    href: "#sydney",
    id: "sydney",
    title: "Sydney",
  },
  {
    address: "100 Jonson Street\nByron Bay NSW 2481 AU",
    ctaLabel: "View store",
    href: "#byron-bay",
    id: "byron-bay",
    title: "Byron Bay",
  },
] as const;
const args = {
  description: "Say hello to our friendly team at one of these locations.",
  eyebrow: "Our locations",
  heading: "Visit our stores",
  locations,
  mapTitle: "Our address",
  mapUrl: "https://snazzymaps.com/embed/451871",
} as const;

export default {
  ...componentMeta("contact-features-tabs-map-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Features Tabs Map 02",
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
    const melbourne = await canvas.findByRole("tab", { name: /Melbourne/u });
    const sydney = canvas.getByRole("tab", { name: /Sydney/u });
    await expect(melbourne).toHaveAttribute("aria-selected", "true");
    melbourne.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(sydney).toHaveAttribute("aria-selected", "true"));
    await userEvent.click(canvas.getByRole("tab", { name: /Byron Bay/u }));
    await waitFor(() =>
      expect(canvas.getByRole("tab", { name: /Byron Bay/u })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    const store = canvas.getAllByRole("link", { name: "View store" })[2];
    await expect(store).toHaveAttribute("href", "#byron-bay");
    await userEvent.click(store);
    await waitFor(() =>
      expect(canvas.getAllByRole("link", { name: "View store" })[2]).toHaveAttribute(
        "href",
        "#store-opened",
      ),
    );
    await expect(canvas.getByTitle("Our address")).toHaveAttribute(
      "src",
      "https://snazzymaps.com/embed/451871",
    );
  },
};
