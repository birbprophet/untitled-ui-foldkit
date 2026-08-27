/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noNewError, effect/noReturnInArrow, effect/noSpread, effect/noTernary, effect/noThrowStatement, mps/avoid-direct-tag-checks, mps/avoid-untagged-errors -- Storybook's browser interaction API is promise based; a missing checked-in fixture is an explicit story defect. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogSectionSplitLayout02,
  blogSectionSplitLayout02Articles,
} from "../../../../../packages/ui/src/marketing/blog-section-split-layout-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  heading: S.String,
  viewAllLabel: S.String,
});
type Model = typeof Args.Type;
type Message =
  | Readonly<{ _tag: "ArticleSelected"; id: string }>
  | Readonly<{ _tag: "AuthorSelected"; id: string }>
  | Readonly<{ _tag: "CategorySelected"; id: string }>
  | Readonly<{ _tag: "ViewAllSelected" }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ViewAllSelected") {
      return { ...model, viewAllLabel: "All posts opened" };
    }
    if (message._tag === "ArticleSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id ? { ...article, href: "#article-opened" } : article,
        ),
      };
    }
    if (message._tag === "CategorySelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? { ...article, category: { ...article.category, href: "#category-opened" } }
            : article,
        ),
      };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id
          ? { ...article, author: { ...article.author, href: "#author-opened" } }
          : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogSectionSplitLayout02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogSectionSplitLayout02(
          {
            ...model,
            onArticle: (id): Message => ({ _tag: "ArticleSelected", id }),
            onAuthor: (id): Message => ({ _tag: "AuthorSelected", id }),
            onCategory: (id): Message => ({ _tag: "CategorySelected", id }),
            onViewAll: { _tag: "ViewAllSelected" },
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogSectionSplitLayout02Articles],
  description: "The latest industry news, interviews, technologies, and resources.",
  heading: "From the blog",
  viewAllLabel: "View all posts",
} satisfies typeof Args.Type;

export default {
  ...componentMeta("blog-section-split-layout-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Split Layout 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs): Model => ({ ...storyArgs, viewAllLabel: "All posts opened" }),
  }),
  args,
};
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
    const viewAll = await canvas.findByRole("button", { name: "View all posts" });
    await userEvent.click(viewAll);
    await canvas.findByRole("button", { name: "All posts opened" });

    const articleLinks = await canvas.findAllByRole("link", { name: "UX review presentations" });
    const article = articleLinks.at(-1);
    if (article === undefined) {
      throw new Error("Missing authenticated article link");
    }
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    article.blur();
  },
};
