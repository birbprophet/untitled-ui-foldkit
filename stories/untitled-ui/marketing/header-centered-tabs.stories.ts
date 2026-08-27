/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { headerCenteredTabs } from "../../../../../packages/ui/src/marketing/header-centered-tabs.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  selectedTabId: S.String,
  tabs: S.Array(S.Struct({ id: S.String, label: S.String })),
  tabsId: S.String,
});
type Model = typeof Args.Type;
const TabSelected = m("HeaderCenteredTabsTabSelected", { tabId: S.String });
type Message = typeof TabSelected.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    message._tag === "HeaderCenteredTabsTabSelected"
      ? { ...model, selectedTabId: message.tabId }
      : model,
  view: (model: Model, h: Parameters<typeof headerCenteredTabs<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [headerCenteredTabs({ ...model, onTab: (tabId) => TabSelected({ tabId }) }, h)],
    ),
} as const;

const args = {
  description: "Simple, transparent pricing that grows with you.",
  eyebrow: "Pricing",
  heading: "Simple, transparent pricing",
  selectedTabId: "monthly",
  tabs: [
    { id: "monthly", label: "Monthly billing" },
    { id: "annually", label: "Annual billing" },
  ],
  tabsId: "tabs-tabs",
} as const;

export default {
  ...componentMeta("header-centered-tabs"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Centered Tabs",
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
    await expect(canvas.getByRole("heading", { level: 1 })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Annual billing" }));
  },
};
