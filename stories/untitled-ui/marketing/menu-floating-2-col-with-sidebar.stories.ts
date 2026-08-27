/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menuFloating2ColWithSidebar } from "../../../src/marketing/menu-floating-2-col-with-sidebar.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuColumns, marketingMenuTutorials } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({ allTutorialsLabel: S.String, tutorialsTitle: S.String });
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("MenuFloating2ColWithSidebarAction", { id: S.String });
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menuFloating2ColWithSidebar<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menuFloating2ColWithSidebar(
          {
            allTutorialsLabel: model.allTutorialsLabel,
            columns: marketingMenuColumns,
            onAllTutorials: Actioned({ id: "all-tutorials" }),
            onItem: (id) => Actioned({ id }),
            tutorials: marketingMenuTutorials.map((tutorial) => ({
              ...tutorial,
              onWatch: Actioned({ id: tutorial.id }),
            })),
            tutorialsTitle: model.tutorialsTitle,
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  allTutorialsLabel: "View all tutorials",
  tutorialsTitle: "Video tutorials",
} as const;

export default {
  ...componentMeta("menu-floating-2-col-with-sidebar"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu Floating 2 Col With Sidebar",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menuFloating2ColWithSidebar<Message>>[1]) =>
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
