/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menuBlogPostsWithFooter } from "../../../src/marketing/menu-blog-posts-with-footer.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuBlogPosts } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({
  documentationLabel: S.String,
  isFloating: S.Boolean,
  isMobile: S.Boolean,
  viewAllBlogPostsLabel: S.String,
  viewAllPostsLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("MenuBlogPostsWithFooterAction", { id: S.String });
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menuBlogPostsWithFooter<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menuBlogPostsWithFooter(
          {
            documentationLabel: model.documentationLabel,
            isFloating: model.isFloating,
            isMobile: model.isMobile,
            onDocumentation: Actioned({ id: "documentation" }),
            onPost: (id) => Actioned({ id }),
            onViewAllBlogPosts: Actioned({ id: "view-all-blog-posts" }),
            onViewAllPosts: Actioned({ id: "view-all-posts" }),
            posts: marketingMenuBlogPosts,
            viewAllBlogPostsLabel: model.viewAllBlogPostsLabel,
            viewAllPostsLabel: model.viewAllPostsLabel,
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  documentationLabel: "Documentation",
  isFloating: false,
  isMobile: false,
  viewAllBlogPostsLabel: "View all blog posts",
  viewAllPostsLabel: "View all posts",
} as const;

export default {
  ...componentMeta("menu-blog-posts-with-footer"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu Blog Posts With Footer",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { ...args, isFloating: true } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menuBlogPostsWithFooter<Message>>[1]) =>
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
