/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  careersCard04,
  careersCard04Categories,
  careersCard04LocationValues,
} from "../../../src/marketing/careers-card-04.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const BadgeColor = S.Literals([
  "gray",
  "brand",
  "error",
  "warning",
  "success",
  "slate",
  "sky",
  "blue",
  "indigo",
  "purple",
  "pink",
  "orange",
]);
const Job = S.Struct({
  badgeColor: BadgeColor,
  badgeText: S.String,
  description: S.String,
  href: S.String,
  id: S.String,
  location: S.Struct({ city: S.String, country: S.String, countryCode: S.String }),
  salary: S.String,
  title: S.String,
  type: S.String,
});
const Category = S.Struct({
  description: S.String,
  id: S.String,
  jobs: S.Array(Job),
  label: S.String,
});
const Location = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  categories: S.Array(Category),
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
  imageSrc: S.String,
  locationLabel: S.String,
  locations: S.Array(Location),
  selectedLocationId: S.String,
});
type Model = typeof Args.Type;
type Message =
  | Readonly<{ _tag: "JobSelected"; id: string }>
  | Readonly<{ _tag: "LocationFocused"; id: string }>
  | Readonly<{ _tag: "LocationOpenChanged"; isOpen: boolean }>
  | Readonly<{ _tag: "LocationSelected"; id: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "LocationSelected") {
      return { ...model, selectedLocationId: message.id };
    }
    if (message._tag === "JobSelected") {
      return {
        ...model,
        categories: model.categories.map((category) => ({
          ...category,
          jobs: category.jobs.map((job) =>
            job.id === message.id ? { ...job, href: "#job-opened" } : job,
          ),
        })),
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof careersCard04<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        careersCard04(
          {
            ...model,
            locations: model.locations.map((location) => ({
              ...location,
              onFocus: { _tag: "LocationFocused", id: location.id } satisfies Message,
              onSelect: { _tag: "LocationSelected", id: location.id } satisfies Message,
            })),
            onJob: (id): Message => ({ _tag: "JobSelected", id }),
            onLocationOpenChanged: (isOpen): Message => ({
              _tag: "LocationOpenChanged",
              isOpen,
            }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  categories: [...careersCard04Categories],
  description:
    "Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
  heading: "Start doing work that matters",
  imageAlt: "Collaboration",
  imageSrc: "https://www.untitledui.com/marketing/collaboration.webp",
  locationLabel: "Location:",
  locations: [...careersCard04LocationValues],
  selectedLocationId: "worldwide",
} satisfies Model;

export default {
  ...componentMeta("careers-card-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Card 04",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, selectedLocationId: "europe" },
};
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
    await expect(await canvas.findByRole("img", { name: "Collaboration" })).toBeInTheDocument();

    const locationTrigger = await canvas.findByRole("button", { name: /Worldwide/u });
    await userEvent.click(locationTrigger);
    await userEvent.click(await canvas.findByRole("option", { name: /Europe/u }));
    await waitFor(() => expect(locationTrigger).toHaveAccessibleName(/Europe/u));

    const job = await canvas.findByRole("link", { name: /Product Designer/u });
    job.focus();
    await expect(job).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(job).toHaveAttribute("href", "#job-opened"));
    job.blur();
  },
};
