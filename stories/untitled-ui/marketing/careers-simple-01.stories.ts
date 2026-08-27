/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { careersSimple01 } from "../../../src/marketing/careers-simple-01.ts";
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
  location: S.String,
  title: S.String,
  type: S.String,
});
const Args = S.Struct({
  description: S.String,
  heading: S.String,
  jobs: S.Array(Job),
});
type Model = typeof Args.Type;
const Selected = m("CareersSimple01JobSelected", { id: S.String });
type Message = typeof Selected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    jobs: model.jobs.map((job) => (job.id === message.id ? { ...job, href: "#job-opened" } : job)),
  }),
  view: (model: Model, h: Parameters<typeof careersSimple01<Message>>[1]) =>
    careersSimple01({ ...model, onJob: (id) => Selected({ id }) }, h),
} as const;

const jobs = [
  {
    badgeColor: "blue",
    badgeText: "Design",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "product-designer",
    location: "Remote",
    title: "Product Designer",
    type: "Full-time",
  },
  {
    badgeColor: "pink",
    badgeText: "Software Development",
    description: "We're looking for an experienced engineering manager to join our team.",
    href: "#",
    id: "engineering-manager",
    location: "Remote",
    title: "Engineering Manager",
    type: "Full-time",
  },
  {
    badgeColor: "success",
    badgeText: "Careers",
    description: "We're looking for a customer success manager to join our team.",
    href: "#",
    id: "customer-success-manager",
    location: "Remote",
    title: "Customer Success Manager",
    type: "Full-time",
  },
  {
    badgeColor: "indigo",
    badgeText: "Sales",
    description: "We're looking for an account executive to join our team.",
    href: "#",
    id: "account-executive",
    location: "Remote",
    title: "Account Executive",
    type: "Full-time",
  },
  {
    badgeColor: "orange",
    badgeText: "Marketing",
    description: "We're looking for an experienced SEO marketing manager to join our team.",
    href: "#",
    id: "seo-marketing-manager",
    location: "Remote",
    title: "SEO Marketing Manager",
    type: "Full-time",
  },
] as const;

const args = {
  description: "We're a 100% remote team spread all across the world. Join us!",
  heading: "Open positions",
  jobs,
} as const;

export default {
  ...componentMeta("careers-simple-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Simple 01",
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
    const link = await within(canvasElement).findByRole("link", { name: /Product Designer/u });
    link.focus();
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(link).toHaveAttribute("href", "#job-opened"));
    link.blur();
  },
};
