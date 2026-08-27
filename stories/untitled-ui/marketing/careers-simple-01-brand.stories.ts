/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { careersSimple01Brand } from "../../../src/marketing/careers-simple-01-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Job = S.Struct({
  badgeColor: S.Union([
    S.Literal("blue"),
    S.Literal("indigo"),
    S.Literal("orange"),
    S.Literal("pink"),
    S.Literal("success"),
  ]),
  badgeText: S.optional(S.String),
  description: S.String,
  href: S.String,
  id: S.String,
  location: S.String,
  title: S.String,
  type: S.String,
});
const Args = S.Struct({ description: S.String, heading: S.String, jobs: S.Array(Job) });
type Model = typeof Args.Type;
const Selected = m("CareersSimple01BrandJobSelected", { id: S.String });
type Message = typeof Selected.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    jobs: model.jobs.map((job) => (job.id === message.id ? { ...job, href: "#job-opened" } : job)),
  }),
  view: (model: Model, h: Parameters<typeof careersSimple01Brand<Message>>[1]) =>
    careersSimple01Brand({ ...model, onJob: (id) => Selected({ id }) }, h),
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
    badgeText: "Customer Success",
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
  {
    badgeColor: "orange",
    badgeText: "Marketing",
    description: "We're looking for a senior user researcher to join our team.",
    href: "#",
    id: "ux-researcher",
    location: "Remote",
    title: "UX Researcher",
    type: "Full-time",
  },
] as const;
const args = {
  description: "We're a 100% remote team spread all across the world. Join us!",
  heading: "Open positions",
  jobs,
} as const;

export default {
  ...componentMeta("careers-simple-01-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Simple 01 Brand",
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
    const list = await within(canvasElement).findByRole("list");
    await expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    const link = within(list).getByRole("link", { name: /Product Designer/u });
    await userEvent.click(link);
    await waitFor(() => expect(link).toHaveAttribute("href", "#job-opened"));
    link.blur();
  },
};
