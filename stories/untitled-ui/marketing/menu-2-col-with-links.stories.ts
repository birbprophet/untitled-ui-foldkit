/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menu2ColWithLinks } from "../../../src/marketing/menu-2-col-with-links.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuColumns, marketingMenuGetStartedItems } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({ getStartedTitle: S.String });
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("Menu2ColWithLinksAction", { id: S.String });
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menu2ColWithLinks<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menu2ColWithLinks(
          {
            columns: marketingMenuColumns,
            getStartedItems: marketingMenuGetStartedItems,
            getStartedTitle: model.getStartedTitle,
            onGetStarted: (id) => Actioned({ id }),
            onItem: (id) => Actioned({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = { getStartedTitle: "Get started" } as const;

export default {
  ...componentMeta("menu-2-col-with-links"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu 2 Col With Links",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menu2ColWithLinks<Message>>[1]) =>
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
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeVisible());
  },
};
