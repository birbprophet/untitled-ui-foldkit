/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogSectionCarouselLayout02,
  blogSectionCarouselLayout02Articles,
} from "../../../src/marketing/blog-section-carousel-layout-02.ts";
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
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  heading: S.String,
  nextLabel: S.String,
  previousLabel: S.String,
  selectedIndex: S.Number,
  viewAllLabel: S.String,
});
type Model = typeof Args.Type;
type Message =
  | Readonly<{ _tag: "ArticleSelected"; id: string }>
  | Readonly<{ _tag: "CategorySelected"; id: string }>
  | Readonly<{ _tag: "Next" }>
  | Readonly<{ _tag: "Previous" }>
  | Readonly<{ _tag: "TagSelected"; id: string; tag: string }>
  | Readonly<{ _tag: "ViewAll" }>;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Next") {
      return { ...model, selectedIndex: Math.min(3, model.selectedIndex + 1) };
    }
    if (message._tag === "Previous") {
      return { ...model, selectedIndex: Math.max(0, model.selectedIndex - 1) };
    }
    if (message._tag === "ViewAll") {
      return { ...model, viewAllLabel: "All posts" };
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
          ? {
              ...article,
              tags: article.tags.map((tag) =>
                tag.name === message.tag ? { ...tag, href: "#tag-opened" } : tag,
              ),
            }
          : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogSectionCarouselLayout02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogSectionCarouselLayout02(
          {
            ...model,
            onArticle: (id): Message => ({ _tag: "ArticleSelected", id }),
            onCategory: (id): Message => ({ _tag: "CategorySelected", id }),
            onNext: { _tag: "Next" },
            onPrevious: { _tag: "Previous" },
            onTag: (id, tag): Message => ({ _tag: "TagSelected", id, tag }),
            onViewAll: { _tag: "ViewAll" },
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogSectionCarouselLayout02Articles],
  description: "The latest news, technologies, and resources from our team.",
  heading: "Latest writings",
  nextLabel: "Next slide",
  previousLabel: "Previous slide",
  selectedIndex: 0,
  viewAllLabel: "View all posts",
} satisfies Model;

export default {
  ...componentMeta("blog-section-carousel-layout-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Carousel Layout 02",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { ...args, selectedIndex: 2 } };
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
    const carousel = await canvas.findByRole("region", { name: "Latest writings" });
    const previous = canvas.getByRole("button", { name: "Previous slide" });
    const next = canvas.getByRole("button", { name: "Next slide" });
    await expect(previous).toBeDisabled();

    carousel.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(previous).toBeEnabled();
    await userEvent.click(next);

    const article = canvas
      .getAllByRole("link", { name: /UX review presentations/u })
      .find((candidate) => candidate.tabIndex !== -1);
    await expect(article).toBeDefined();
    article?.focus();
    await expect(article).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(article).toHaveAttribute("href", "#category-opened"));

    await userEvent.click(canvas.getByRole("button", { name: "View all posts" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "All posts" })).toBeVisible());
  },
};
