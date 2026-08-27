/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderFeaturedPost02,
  blogHeaderFeaturedPost02Articles,
  blogHeaderFeaturedPost02FeaturedArticle,
  blogHeaderFeaturedPost02Tabs,
} from "../../../src/marketing/blog-header-featured-post-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Tab = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  articles: S.Array(Article),
  categoriesLabel: S.String,
  description: S.String,
  eyebrow: S.String,
  featuredArticle: Article,
  heading: S.String,
  searchPlaceholder: S.String,
  tabs: S.Array(Tab),
  totalPages: S.Finite,
});
type Args = typeof Args.Type;
const Model = S.Struct({
  ...Args.fields,
  currentPage: S.Finite,
  focusedTabId: S.String,
  searchQuery: S.String,
  selectedTabId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "ArticleSelected"; id: string }>
  | Readonly<{ _tag: "AuthorSelected"; id: string }>
  | Readonly<{ _tag: "CategorySelected"; id: string }>
  | Readonly<{ _tag: "PageSelected"; page: number }>
  | Readonly<{ _tag: "SearchChanged"; query: string }>
  | Readonly<{ _tag: "TabFocused"; id: string }>
  | Readonly<{ _tag: "TabSelected"; id: string }>;

const definition = {
  Args,
  Model,
  init: (args: Args): Model => ({
    ...args,
    currentPage: 1,
    focusedTabId: "all",
    searchQuery: "",
    selectedTabId: "all",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "SearchChanged") {
      return { ...model, searchQuery: message.query };
    }
    if (message._tag === "TabFocused") {
      return { ...model, focusedTabId: message.id };
    }
    if (message._tag === "TabSelected") {
      return { ...model, focusedTabId: message.id, selectedTabId: message.id };
    }
    if (message._tag === "PageSelected") {
      return { ...model, currentPage: message.page };
    }
    if (message._tag === "ArticleSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id ? { ...article, href: "#article-opened" } : article,
        ),
        featuredArticle:
          model.featuredArticle.id === message.id
            ? { ...model.featuredArticle, href: "#article-opened" }
            : model.featuredArticle,
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof blogHeaderFeaturedPost02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderFeaturedPost02(
          {
            ...model,
            onArticle: (id): Message => ({ _tag: "ArticleSelected", id }),
            onAuthor: (id): Message => ({ _tag: "AuthorSelected", id }),
            onCategory: (id): Message => ({ _tag: "CategorySelected", id }),
            onPage: (page): Message => ({ _tag: "PageSelected", page }),
            onSearch: (query): Message => ({ _tag: "SearchChanged", query }),
            onTabFocus: (id): Message => ({ _tag: "TabFocused", id }),
            onTabSelect: (id): Message => ({ _tag: "TabSelected", id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogHeaderFeaturedPost02Articles],
  categoriesLabel: "Blog categories",
  description: "The latest industry news, interviews, technologies, and resources.",
  eyebrow: "Our blog",
  featuredArticle: blogHeaderFeaturedPost02FeaturedArticle,
  heading: "The latest writings from our team",
  searchPlaceholder: "Search",
  tabs: [...blogHeaderFeaturedPost02Tabs],
  totalPages: 10,
} satisfies Args;

export default {
  ...componentMeta("blog-header-featured-post-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Featured Post 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs): Model => ({
      ...definition.init(storyArgs),
      focusedTabId: "design",
      searchQuery: "design",
      selectedTabId: "design",
    }),
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

    const search = await canvas.findByRole("searchbox", { name: "Search" });
    await userEvent.type(search, "design");
    await waitFor(() => expect(search).toHaveValue("design"));

    const design = await canvas.findByRole("tab", { name: "Design" });
    await userEvent.click(design);
    await waitFor(() => expect(design).toHaveAttribute("aria-selected", "true"));

    const next = await canvas.findByRole("button", { name: "Next" });
    await userEvent.click(next);
    const pageTwo = await canvas.findByLabelText("Page 2");
    await waitFor(() => expect(pageTwo).toHaveAttribute("aria-current", "page"));

    const article = await canvas.findByRole("link", { name: /UX review presentations/u });
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    article.blur();
  },
};
