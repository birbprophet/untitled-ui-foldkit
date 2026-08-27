/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Pending Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { careersSimple02Brand } from "../../../src/marketing/careers-simple-02-brand.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Job = S.Struct({
  description: S.String,
  href: S.String,
  id: S.String,
  location: S.String,
  title: S.String,
  type: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  jobs: S.Array(Job),
});
type Model = typeof Args.Type;
const Selected = m("CareersSimple02BrandJobSelected", { id: S.String });
type Message = typeof Selected.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({
    ...model,
    jobs: model.jobs.map((job) => (job.id === message.id ? { ...job, href: "#job-opened" } : job)),
  }),
  view: (model: Model, h: Parameters<typeof careersSimple02Brand<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [careersSimple02Brand({ ...model, onJob: (id) => Selected({ id }) }, h)],
    ),
} as const;
const jobs = [
  {
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "product-designer",
    location: "Remote",
    title: "Product Designer",
    type: "Full-time",
  },
  {
    description: "We're looking for an experienced engineering manager to join our team.",
    href: "#",
    id: "engineering-manager",
    location: "Remote",
    title: "Engineering Manager",
    type: "Full-time",
  },
  {
    description: "We're looking for a customer success manager to join our team.",
    href: "#",
    id: "customer-success-manager",
    location: "Remote",
    title: "Customer Success Manager",
    type: "Full-time",
  },
  {
    description: "We're looking for an account executive to join our team.",
    href: "#",
    id: "account-executive",
    location: "Remote",
    title: "Account Executive",
    type: "Full-time",
  },
  {
    description: "We're looking for an experienced SEO marketing manager to join our team.",
    href: "#",
    id: "seo-marketing-manager",
    location: "Remote",
    title: "SEO Marketing Manager",
    type: "Full-time",
  },
  {
    description: "We're looking for a senior user researcher to join our team.",
    href: "#",
    id: "ux-researcher",
    location: "Remote",
    title: "UX Researcher",
    type: "Full-time",
  },
] as const;
const args = {
  description:
    "Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
  eyebrow: "We're hiring!",
  heading: "Join our team",
  jobs,
} as const;
export default {
  ...componentMeta("careers-simple-02-brand"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Careers/Careers Simple 02 Brand",
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
    await userEvent.click(link);
    await waitFor(() => expect(link).toHaveAttribute("href", "#job-opened"));
  },
};
