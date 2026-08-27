/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  careersCard02,
  careersCard02Jobs,
  careersCard02Locations,
} from "../../../src/marketing/careers-card-02.ts";
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
  department: S.String,
  description: S.String,
  href: S.String,
  id: S.String,
  location: S.String,
  title: S.String,
  type: S.String,
});
const Location = S.Struct({
  id: S.String,
  isDisabled: S.optional(S.Boolean),
  label: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  filterLabel: S.String,
  heading: S.String,
  jobs: S.Array(Job),
  locations: S.Array(Location),
});
type Args = typeof Args.Type;
const Model = S.Struct({
  ...Args.fields,
  isLocationOpen: S.Boolean,
  selectedLocationId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "JobSelected"; id: string }>
  | Readonly<{ _tag: "LocationFocused"; id: string }>
  | Readonly<{ _tag: "LocationOpenChanged"; open: boolean }>
  | Readonly<{ _tag: "LocationSelected"; id: string }>;

const definition = {
  Args,
  Model,
  init: (args: Args): Model => ({
    ...args,
    isLocationOpen: false,
    selectedLocationId: "worldwide",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "LocationOpenChanged") {
      return { ...model, isLocationOpen: message.open };
    }
    if (message._tag === "LocationSelected") {
      return { ...model, isLocationOpen: false, selectedLocationId: message.id };
    }
    if (message._tag === "JobSelected") {
      return {
        ...model,
        jobs: model.jobs.map((job) =>
          job.id === message.id ? { ...job, href: "#job-opened" } : job,
        ),
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof careersCard02<Message>>[1]) =>
    careersCard02(
      {
        ...model,
        onJob: (id): Message => ({ _tag: "JobSelected", id }),
        onLocationFocus: (id): Message => ({ _tag: "LocationFocused", id }),
        onLocationOpenChanged: (open): Message => ({ _tag: "LocationOpenChanged", open }),
        onLocationSelect: (id): Message => ({ _tag: "LocationSelected", id }),
      },
      h,
    ),
} as const;

const args = {
  description:
    "Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
  eyebrow: "We're hiring!",
  filterLabel: "Filter by location",
  heading: "Join our team",
  jobs: [...careersCard02Jobs],
  locations: [...careersCard02Locations],
} satisfies Args;

export default {
  ...componentMeta("careers-card-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Card 02",
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
    const locationTrigger = await canvas.findByRole("button", { name: /Worldwide/u });
    await userEvent.click(locationTrigger);
    const europe = await canvas.findByRole("option", { name: /Europe/u });
    const oceania = await canvas.findByRole("option", { name: /Oceania/u });
    await expect(oceania).toBeDisabled();
    await userEvent.click(europe);
    await waitFor(() => expect(locationTrigger).toHaveAccessibleName(/Europe/u));

    const job = await canvas.findByRole("link", { name: /Product Designer/u });
    await userEvent.click(job);
    await waitFor(() => expect(job).toHaveAttribute("href", "#job-opened"));
    job.blur();
  },
};
