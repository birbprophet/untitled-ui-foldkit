/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderSimple04,
  blogHeaderSimple04Articles,
} from "../../../src/marketing/blog-header-simple-04.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const TagColor = S.Union([
  S.Literal("brand"),
  S.Literal("indigo"),
  S.Literal("orange"),
  S.Literal("pink"),
  S.Literal("sky"),
  S.Literal("slate"),
  S.Literal("success"),
]);
const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  tags: S.Array(S.Struct({ color: TagColor, href: S.String, name: S.String })),
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  email: S.String,
  eyebrow: S.String,
  heading: S.String,
});
type Args = typeof Args.Type;
type Message =
  | Readonly<{
      _tag: "ArticleActivated";
      articleId: string;
      target: "article" | "author" | "category";
    }>
  | Readonly<{ _tag: "EmailInput"; email: string }>
  | Readonly<{ _tag: "LoadMore" }>
  | Readonly<{ _tag: "Subscribed" }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, message: Message): Args => {
    if (message._tag === "EmailInput") {
      return { ...model, email: message.email };
    }
    if (message._tag === "Subscribed") {
      return { ...model, email: "subscribed@example.com" };
    }
    if (message._tag === "ArticleActivated") {
      return {
        ...model,
        articles: model.articles.map((article) => {
          if (article.id !== message.articleId) {
            return article;
          }
          if (message.target === "author") {
            return { ...article, author: { ...article.author, href: "#author-opened" } };
          }
          if (message.target === "category") {
            return { ...article, category: { ...article.category, href: "#category-opened" } };
          }
          return { ...article, href: "#article-opened" };
        }),
      };
    }
    return model;
  },
  view: (model: Args, h: Parameters<typeof blogHeaderSimple04<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderSimple04(
          {
            ...model,
            onArticleActivate: ({ articleId, target }): Message => ({
              _tag: "ArticleActivated",
              articleId,
              target,
            }),
            onEmailInput: (email): Message => ({ _tag: "EmailInput", email }),
            onLoadMore: { _tag: "LoadMore" },
            onSubscribe: { _tag: "Subscribed" },
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogHeaderSimple04Articles],
  description: "Tool and strategies modern teams need to help their companies grow.",
  email: "",
  eyebrow: "Resources",
  heading: "Siglata blog",
} satisfies Args;

export default {
  ...componentMeta("blog-header-simple-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 04",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "reader@example.com" },
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

    const email = await canvas.findByPlaceholderText("Enter your email");
    await userEvent.type(email, "reader@example.com");
    await waitFor(() => expect(email).toHaveValue("reader@example.com"));

    const subscribe = await canvas.findByRole("button", { name: "Subscribe" });
    subscribe.focus();
    await expect(subscribe).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(email).toHaveValue("subscribed@example.com"));

    const article = await canvas.findByRole("link", { name: "UX review presentations" });
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#category-opened"));

    const loadMore = await canvas.findByRole("button", { name: "Load more" });
    await userEvent.click(loadMore);
    loadMore.blur();
  },
};
