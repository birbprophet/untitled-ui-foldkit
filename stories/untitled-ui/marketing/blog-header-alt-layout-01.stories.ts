/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderAltLayout01,
  blogHeaderAltLayout01Articles,
} from "../../../src/marketing/blog-header-alt-layout-01.ts";

import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  email: S.String,
  page: S.Finite,
});
type Args = typeof Args.Type;
type Message =
  | Readonly<{
      _tag: "ArticleActivated";
      articleId: string;
      target: "article" | "author" | "category";
    }>
  | Readonly<{ _tag: "EmailInput"; email: string }>
  | Readonly<{ _tag: "PageChanged"; page: number }>
  | Readonly<{ _tag: "Subscribed" }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Args): Args => args,
  update: (model: Args, message: Message): Args => {
    if (message._tag === "EmailInput") {
      return { ...model, email: message.email };
    }
    if (message._tag === "PageChanged") {
      return { ...model, page: message.page };
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
  view: (model: Args, h: Parameters<typeof blogHeaderAltLayout01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderAltLayout01(
          {
            ...model,
            onArticleActivate: ({ articleId, target }): Message => ({
              _tag: "ArticleActivated",
              articleId,
              target,
            }),
            onEmailInput: (email): Message => ({ _tag: "EmailInput", email }),
            onPageChange: (page): Message => ({ _tag: "PageChanged", page }),
            onSubscribe: { _tag: "Subscribed" },
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogHeaderAltLayout01Articles],
  email: "",
  page: 1,
} satisfies Args;

export default {
  ...componentMeta("blog-header-alt-layout-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Alt Layout 01",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "reader@example.com", page: 2 },
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

    const subscribe = await canvas.findByRole("button", { name: "Get started" });
    subscribe.focus();
    await expect(subscribe).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    const pageTwo = await canvas.findByRole("button", { name: "Page 2" });
    await userEvent.click(pageTwo);
    await waitFor(() => expect(pageTwo).toHaveAttribute("aria-current", "page"));

    const title = await canvas.findByRole("link", { name: "UX review presentations" });
    await userEvent.click(title);
    await waitFor(() => expect(title).toHaveAttribute("href", "#category-opened"));
    title.blur();
  },
};
