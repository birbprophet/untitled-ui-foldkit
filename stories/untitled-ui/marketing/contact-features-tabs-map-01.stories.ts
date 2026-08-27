/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactFeaturesTabsMap01 } from "../../../../../packages/ui/src/marketing/contact-features-tabs-map-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Location = S.Struct({ id: S.String, subtitle: S.String, title: S.String });
const Args = S.Struct({
  badgeLabel: S.String,
  description: S.String,
  heading: S.String,
  locations: S.Array(Location),
  mapSrc: S.String,
  mapTitle: S.String,
});
const Model = S.Struct({ ...Args.fields, selectedId: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected"; id: string }>;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selectedId: "melbourne" }),
  update: (model: Model, message: Message): Model => ({ ...model, selectedId: message.id }),
  view: (model: Model, h: Parameters<typeof contactFeaturesTabsMap01<Message>>[1]) =>
    contactFeaturesTabsMap01(
      { ...model, onSelect: (id): Message => ({ _tag: "Selected", id }) },
      h,
    ),
} as const;

const args = {
  badgeLabel: "Stores",
  description: "Say hello to our friendly team at one of these locations.",
  heading: "Our locations",
  locations: [
    {
      id: "melbourne",
      subtitle: "100 Flinders Street\nMelbourne VIC 3000 AU",
      title: "Melbourne",
    },
    {
      id: "sydney",
      subtitle: "100 George Street\nSydney NSW 2000 AU",
      title: "Sydney",
    },
    {
      id: "byron-bay",
      subtitle: "100 Jonson Street\nByron Bay NSW 2481 AU",
      title: "Byron Bay",
    },
  ],
  mapSrc: "https://snazzymaps.com/embed/451894",
  mapTitle: "Our address",
} as const;

export default {
  ...componentMeta("contact-features-tabs-map-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Features Tabs Map 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({ ...storyArgs, selectedId: "byron-bay" }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    await expect(canvas.getByTitle("Our address")).toHaveAttribute(
      "src",
      "https://snazzymaps.com/embed/451894",
    );
    const melbourne = canvas.getByRole("tab", { name: /Melbourne/u });
    melbourne.focus();
    await expect(melbourne).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    const sydney = canvas.getByRole("tab", { name: /Sydney/u });
    await waitFor(() => expect(sydney).toHaveAttribute("aria-selected", "true"));
    await expect(sydney).toHaveFocus();
    await userEvent.click(canvas.getByRole("tab", { name: /Byron Bay/u }));
    await expect(canvas.getByRole("tab", { name: /Byron Bay/u })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
