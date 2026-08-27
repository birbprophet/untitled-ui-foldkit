/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and browser interactions use promise APIs. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { careersCard01 } from "../../../src/marketing/careers-card-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Department = S.Struct({ id: S.String, label: S.String });
const Job = S.Struct({
  badgeColor: S.Union([
    S.Literal("blue"),
    S.Literal("pink"),
    S.Literal("success"),
    S.Literal("indigo"),
    S.Literal("orange"),
  ]),
  badgeText: S.String,
  department: S.String,
  description: S.String,
  href: S.String,
  id: S.String,
  location: S.String,
  title: S.String,
  type: S.String,
});
const Args = S.Struct({
  departments: S.Array(Department),
  description: S.String,
  heading: S.String,
  jobs: S.Array(Job),
  selectedDepartmentId: S.String,
});
type Model = typeof Args.Type;
const DepartmentSelected = m("CareersCard01DepartmentSelected", { id: S.String });
const JobSelected = m("CareersCard01JobSelected", { id: S.String });
type Message = typeof DepartmentSelected.Type | typeof JobSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    message._tag === "CareersCard01DepartmentSelected"
      ? { ...model, selectedDepartmentId: message.id }
      : {
          ...model,
          jobs: model.jobs.map((job) =>
            job.id === message.id ? { ...job, href: "#job-opened" } : job,
          ),
        },
  view: (model: Model, h: Parameters<typeof careersCard01<Message>>[1]) =>
    careersCard01(
      {
        ...model,
        onDepartmentSelect: (id) => DepartmentSelected({ id }),
        onJob: (id) => JobSelected({ id }),
      },
      h,
    ),
} as const;

const departments = [
  { id: "all", label: "View all" },
  { id: "design", label: "Design" },
  { id: "softwareEngineering", label: "Software Engineering" },
  { id: "customerSuccess", label: "Customer Success" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
] as const;

const jobs = [
  {
    badgeColor: "blue",
    badgeText: "Design",
    department: "Design",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "product-designer",
    location: "Remote",
    title: "Product Designer",
    type: "Full-time",
  },
  {
    badgeColor: "pink",
    badgeText: "Software",
    department: "Software Development",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "engineering-manager",
    location: "Remote",
    title: "Engineering Manager",
    type: "Full-time",
  },
  {
    badgeColor: "success",
    badgeText: "CX",
    department: "Customer Success",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "customer-success-manager",
    location: "Remote",
    title: "Customer Success Manager",
    type: "Full-time",
  },
  {
    badgeColor: "indigo",
    badgeText: "Sales",
    department: "Sales",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "account-executive",
    location: "Remote",
    title: "Account Executive",
    type: "Full-time",
  },
  {
    badgeColor: "orange",
    badgeText: "Marketing",
    department: "Marketing",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "seo-marketing-manager",
    location: "Remote",
    title: "SEO Marketing Manager",
    type: "Full-time",
  },
] as const;

const args = {
  departments,
  description: "We're a 100% remote team spread all across the world. Join us!",
  heading: "Open positions",
  jobs,
  selectedDepartmentId: "all",
} as const;

export default {
  ...componentMeta("careers-card-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Card 01",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, selectedDepartmentId: "design" },
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
    const designTab = await canvas.findByRole("tab", { name: "Design" });
    await userEvent.click(designTab);
    await expect(designTab).toHaveAttribute("aria-selected", "true");

    const job = await canvas.findByRole("link", { name: /Product Designer/u });
    await userEvent.click(job);
    await waitFor(() => expect(job).toHaveAttribute("href", "#job-opened"));
    job.blur();
  },
};
