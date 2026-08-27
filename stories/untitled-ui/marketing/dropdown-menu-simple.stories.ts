/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit menu in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, within } from "storybook/test";

import { dropdownMenuSimple } from "../../../src/marketing/dropdown-menu-simple.ts";
import { marketingMenuItems } from "./marketing-menu-fixtures.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
type Model = typeof Args.Type;
const ItemSelected = m("DropdownMenuSimpleItemSelected", { id: S.String });
type Message = typeof ItemSelected.Type;
const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (_model: Model, h: Parameters<typeof dropdownMenuSimple<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        dropdownMenuSimple(
          { items: [...marketingMenuItems], onItem: (id) => ItemSelected({ id }) },
          h,
        ),
      ],
    ),
} as const;
const args = {} as const;
export default {
  ...componentMeta("dropdown-menu-simple"),
  title: "Untitled UI/Marketing/Header Navigation/Dropdown Menu Simple",
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
    await expect(within(canvasElement).getAllByRole("link").length).toBeGreaterThan(0);
  },
};
