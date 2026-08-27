/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { featuresTabsMockup02 } from "../../../../../packages/ui/src/marketing/features-tabs-mockup-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Tab = S.Struct({
  description: S.String,
  id: S.String,
  imageAlt: S.String,
  imageDarkSrc: S.String,
  imageLightSrc: S.String,
  title: S.String,
});
const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  selectedId: S.String,
  tabs: S.Array(Tab),
});
const Model = S.Struct({ ...Args.fields });
const TabSelected = m("FeaturesTabsMockup02TabSelected", { id: S.String });
type Message = typeof TabSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => ({ ...model, selectedId: message.id }),
  view: (model: Model, h: Parameters<typeof featuresTabsMockup02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [featuresTabsMockup02({ ...model, onSelect: (id) => TabSelected({ id }) }, h)],
    ),
} as const;

const args = {
  description:
    "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  eyebrow: "Features",
  heading: "Beautiful analytics to grow smarter",
  selectedId: "collaborate",
  tabs: [
    {
      description:
        "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page.",
      id: "collaborate",
      imageAlt: "Dashboard mockup",
      imageDarkSrc:
        "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
      imageLightSrc:
        "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
      title: "Collaborate",
    },
    {
      description:
        "An all-in-one customer service platform that helps you balance everything your customers need.",
      id: "automate",
      imageAlt: "Dashboard mockup",
      imageDarkSrc:
        "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
      imageLightSrc:
        "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
      title: "Automate",
    },
  ],
} as const;

export default {
  ...componentMeta("features-tabs-mockup-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Features/Features Tabs Mockup 02",
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
    const automate = canvas.getByRole("tab", { name: "Automate" });
    await userEvent.click(automate);
    await waitFor(() => expect(automate).toHaveAttribute("aria-selected", "true"));
  },
};
