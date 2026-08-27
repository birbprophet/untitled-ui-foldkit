/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  careersCard03,
  careersCard03Categories,
} from "../../../../../packages/ui/src/marketing/careers-card-03.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Job = S.Struct({
  badgeColor: S.Union([
    S.Literal("blue"),
    S.Literal("pink"),
    S.Literal("success"),
    S.Literal("indigo"),
    S.Literal("orange"),
  ]),
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
  category: S.String,
  description: S.String,
  id: S.String,
  jobs: S.Array(Job),
});
const Args = S.Struct({
  categories: S.Array(Category),
  description: S.String,
  heading: S.String,
  imageAlt: S.String,
});
type Model = typeof Args.Type;
const Selected = m("CareersCard03JobSelected", { id: S.String });
type Message = typeof Selected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    categories: model.categories.map((category) => ({
      ...category,
      jobs: category.jobs.map((job) =>
        job.id === message.id ? { ...job, href: "#job-opened" } : job,
      ),
    })),
  }),
  view: (model: Model, h: Parameters<typeof careersCard03<Message>>[1]) =>
    h.div([h.Class("-m-8")], [careersCard03({ ...model, onJob: (id) => Selected({ id }) }, h)]),
} as const;

const args = {
  categories: careersCard03Categories,
  description: "We're a 100% remote team spread all across the world. Join us!",
  heading: "We're looking for talented people",
  imageAlt: "Woman artist",
} as const;

export default {
  ...componentMeta("careers-card-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Card 03",
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
    await expect(await canvas.findByRole("img", { name: args.imageAlt })).toBeInTheDocument();
    const link = canvas.getByRole("link", { name: /Product Designer/u });
    link.focus();
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(link).toHaveAttribute("href", "#job-opened"));
    link.blur();
  },
};
