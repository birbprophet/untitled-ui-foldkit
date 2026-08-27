/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, within } from "storybook/test";

import { featuresIntegrationsIcons02 } from "../../../src/marketing/features-integrations-icons-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Item = S.Struct({
  icon: S.Union([
    S.Literal("chat"),
    S.Literal("zap"),
    S.Literal("chart"),
    S.Literal("command"),
    S.Literal("heart"),
    S.Literal("smile"),
    S.Literal("layers"),
    S.Literal("users"),
    S.Literal("shield"),
  ]),
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  imageAlt: S.optional(S.String),
  imageSrc: S.optional(S.String),
  items: S.Array(Item),
  mockupDarkSrc: S.optional(S.String),
  mockupLightSrc: S.optional(S.String),
});
type Model = typeof Args.Type;
const ItemPressed = m("FeaturesIntegrationsIcons02ItemPressed", { id: S.String });
type Message = typeof ItemPressed.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof featuresIntegrationsIcons02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [featuresIntegrationsIcons02({ ...model, onItem: (id) => ItemPressed({ id }) }, h)],
    ),
} as const;

const args = {
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.",
  eyebrow: "Features",
  heading: "Beautiful analytics to grow smarter",
  imageAlt: "Photographer",
  imageSrc: "https://www.untitledui.com/marketing/photographer-girl.webp",
  items: [
    {
      icon: "chat",
      id: "inboxes",
      subtitle:
        "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
      title: "Share team inboxes",
    },
    {
      icon: "zap",
      id: "answers",
      subtitle:
        "An all-in-one customer service platform that helps you balance everything your customers need to be happy.",
      title: "Deliver instant answers",
    },
    {
      icon: "chart",
      id: "reports",
      subtitle:
        "Measure what matters with easy-to-use reports. Filter, export, and drilldown on the data in a couple clicks.",
      title: "Manage your team with reports",
    },
  ],
  mockupDarkSrc:
    "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
  mockupLightSrc:
    "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
} as const;

export default {
  ...componentMeta("features-integrations-icons-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Features/Features Integrations Icons 02",
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
    const heading = canvas.getByRole("heading", { name: args.heading });
    await expect(heading).toBeInTheDocument();
    heading.focus();
  },
};
