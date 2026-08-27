/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based and the authenticated fixture includes placeholders. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderAltLayout03,
  blogHeaderAltLayout03Articles,
  blogHeaderAltLayout03Tabs,
} from "../../../src/marketing/blog-header-alt-layout-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const BadgeColor = S.Literals([
  "gray",
  "brand",
  "error",
  "warning",
  "success",
  "slate",
  "sky",
  "blue",
  "indigo",
  "purple",
  "pink",
  "orange",
]);
const Link = S.Struct({ href: S.String, name: S.String });
const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: Link,
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  tags: S.Array(S.Struct({ color: BadgeColor, href: S.String, name: S.String })),
  thumbnailUrl: S.String,
  title: S.String,
});
const Tab = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  loadMoreLabel: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  search: S.String,
  searchLabel: S.String,
  searchPlaceholder: S.String,
  selectedTabId: S.String,
  subscribeLabel: S.String,
  tabs: S.Array(Tab),
});
type Model = typeof Args.Type;
type Message =
  | Readonly<{ _tag: "ArticleSelected"; id: string }>
  | Readonly<{ _tag: "AuthorSelected"; id: string }>
  | Readonly<{ _tag: "CategorySelected"; id: string }>
  | Readonly<{ _tag: "EmailInput"; email: string }>
  | Readonly<{ _tag: "LoadMore" }>
  | Readonly<{ _tag: "SearchInput"; search: string }>
  | Readonly<{ _tag: "Subscribe" }>
  | Readonly<{ _tag: "TabFocused"; id: string }>
  | Readonly<{ _tag: "TabSelected"; id: string }>
  | Readonly<{ _tag: "TagSelected"; id: string; tag: string }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "EmailInput") {
      return { ...model, email: message.email };
    }
    if (message._tag === "SearchInput") {
      return { ...model, search: message.search };
    }
    if (message._tag === "TabSelected") {
      return { ...model, selectedTabId: message.id };
    }
    if (message._tag === "Subscribe") {
      return { ...model, subscribeLabel: "Subscribed" };
    }
    if (message._tag === "LoadMore") {
      return { ...model, loadMoreLabel: "Loaded" };
    }
    if (message._tag === "ArticleSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id ? { ...article, href: "#article-opened" } : article,
        ),
      };
    }
    if (message._tag === "AuthorSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? { ...article, author: { ...article.author, href: "#author-opened" } }
            : article,
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
    if (message._tag === "TagSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? {
                ...article,
                tags: article.tags.map((tag) =>
                  tag.name === message.tag ? { ...tag, href: "#tag-opened" } : tag,
                ),
              }
            : article,
        ),
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof blogHeaderAltLayout03<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderAltLayout03(
          {
            ...model,
            onArticle: (id): Message => ({ _tag: "ArticleSelected", id }),
            onAuthor: (id): Message => ({ _tag: "AuthorSelected", id }),
            onCategory: (id): Message => ({ _tag: "CategorySelected", id }),
            onEmailInput: (email): Message => ({ _tag: "EmailInput", email }),
            onLoadMore: { _tag: "LoadMore" },
            onSearchInput: (search): Message => ({ _tag: "SearchInput", search }),
            onSubscribe: { _tag: "Subscribe" },
            onTabFocus: (id): Message => ({ _tag: "TabFocused", id }),
            onTabSelect: (id): Message => ({ _tag: "TabSelected", id }),
            onTag: (id, tag): Message => ({ _tag: "TagSelected", id, tag }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogHeaderAltLayout03Articles],
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  email: "",
  emailLabel: "Email address",
  emailPlaceholder: "Enter your email",
  eyebrow: "Blog",
  heading: "Resource library",
  loadMoreLabel: "Load more",
  privacyHref: "#privacy",
  privacyLabel: "privacy policy",
  privacyPrefix: "We care about your data in our",
  search: "",
  searchLabel: "Search",
  searchPlaceholder: "Search",
  selectedTabId: "all",
  subscribeLabel: "Get started",
  tabs: [...blogHeaderAltLayout03Tabs],
} satisfies Model;

export default {
  ...componentMeta("blog-header-alt-layout-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Alt Layout 03",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "olivia@example.com", search: "Design", selectedTabId: "design" },
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

    const email = await canvas.findByRole("textbox", { name: "Email address" });
    await userEvent.type(email, "olivia@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Subscribed" })).toBeVisible());

    const search = canvas.getByRole("textbox", { name: "Search" });
    await userEvent.type(search, "Design");
    await expect(search).toHaveValue("Design");

    const designTab = canvas.getByRole("tab", { name: "Design" });
    await userEvent.click(designTab);
    await expect(designTab).toHaveAttribute("aria-selected", "true");

    const article = canvas
      .getAllByRole("link", { name: /UX review presentations/u })
      .find((candidate) => candidate.tabIndex !== -1);
    await expect(article).toBeDefined();
    article?.focus();
    await expect(article).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(article).toHaveAttribute("href", "#category-opened"));
  },
};
