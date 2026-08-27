/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { headerSpaceBetweenSearch } from "../../../src/marketing/header-space-between-search.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  searchLabel: S.String,
  searchPlaceholder: S.String,
  searchValue: S.String,
});
type Model = typeof Args.Type;
const SearchInput = m("HeaderSpaceBetweenSearchSearchInput", { value: S.String });
type Message = typeof SearchInput.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    message._tag === "HeaderSpaceBetweenSearchSearchInput"
      ? { ...model, searchValue: message.value }
      : model,
  view: (model: Model, h: Parameters<typeof headerSpaceBetweenSearch<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [headerSpaceBetweenSearch({ ...model, onSearch: (value) => SearchInput({ value }) }, h)],
    ),
} as const;

const args = {
  description: "Get help and support or learn how to use the newest features in Siglata.",
  eyebrow: "Resources",
  heading: "Support centre",
  searchLabel: "Search",
  searchPlaceholder: "Search",
  searchValue: "",
} as const;

export default {
  ...componentMeta("header-space-between-search"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Section/Header Space Between Search",
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
    const search = canvas.getByLabelText("Search");
    await userEvent.type(search, "billing");
  },
};
