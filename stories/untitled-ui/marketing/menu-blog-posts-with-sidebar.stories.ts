/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menuBlogPostsWithSidebar } from "../../../src/marketing/menu-blog-posts-with-sidebar.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuBlogPosts, marketingMenuCategoryItems } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({ categoriesTitle: S.String, isMobile: S.Boolean });
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("MenuBlogPostsWithSidebarAction", { id: S.String });
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menuBlogPostsWithSidebar<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menuBlogPostsWithSidebar(
          {
            categoriesTitle: model.categoriesTitle,
            categoryItems: marketingMenuCategoryItems,
            isMobile: model.isMobile,
            onCategory: (id) => Actioned({ id }),
            onPost: (id) => Actioned({ id }),
            posts: marketingMenuBlogPosts,
          },
          h,
        ),
      ],
    ),
} as const;

const args = { categoriesTitle: "Categories", isMobile: false } as const;

export default {
  ...componentMeta("menu-blog-posts-with-sidebar"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu Blog Posts With Sidebar",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menuBlogPostsWithSidebar<Message>>[1]) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args,
};
export const Responsive = {
  ...liveStory(definition),
  args: { ...args, isMobile: true },
};

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
