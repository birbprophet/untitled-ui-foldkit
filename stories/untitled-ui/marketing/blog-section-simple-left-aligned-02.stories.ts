/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionSimpleLeftAligned02 } from "../../../src/marketing/blog-section-simple-left-aligned-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Tag = S.Struct({
  color: S.Union([
    S.Literal("brand"),
    S.Literal("indigo"),
    S.Literal("pink"),
    S.Literal("sky"),
    S.Literal("success"),
    S.Literal("slate"),
  ]),
  href: S.String,
  name: S.String,
});
const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  tags: S.Array(Tag),
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
const ArticleOpened = m("BlogSectionSimpleLeftAligned02ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogSectionSimpleLeftAligned02AuthorOpened", { id: S.String });
const CategoryOpened = m("BlogSectionSimpleLeftAligned02CategoryOpened", { id: S.String });
const TagOpened = m("BlogSectionSimpleLeftAligned02TagOpened", {
  articleId: S.String,
  tagName: S.String,
});
const ViewAll = m("BlogSectionSimpleLeftAligned02ViewAll");
type Message =
  | typeof ArticleOpened.Type
  | typeof AuthorOpened.Type
  | typeof CategoryOpened.Type
  | typeof TagOpened.Type
  | typeof ViewAll.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogSectionSimpleLeftAligned02ViewAll") {
      return { ...model, viewAllLabel: "All posts opened" };
    }
    if (message._tag === "BlogSectionSimpleLeftAligned02TagOpened") {
      return {
        ...model,
        articles: model.articles.map((article) => ({
          ...article,
          tags: article.tags.map((tag) =>
            article.id === message.articleId && tag.name === message.tagName
              ? { ...tag, href: "#tag-opened" }
              : tag,
          ),
        })),
      };
    }
    return {
      ...model,
      articles: model.articles.map((article) => {
        if (article.id !== message.id) {
          return article;
        }
        if (message._tag === "BlogSectionSimpleLeftAligned02AuthorOpened") {
          return { ...article, author: { ...article.author, href: "#author-opened" } };
        }
        if (message._tag === "BlogSectionSimpleLeftAligned02CategoryOpened") {
          return { ...article, category: { ...article.category, href: "#category-opened" } };
        }
        return { ...article, href: "#article-opened" };
      }),
    };
  },
  view: (model: Model, h: Parameters<typeof blogSectionSimpleLeftAligned02<Message>>[1]) =>
    blogSectionSimpleLeftAligned02(
      {
        ...model,
        onArticle: (id) => ArticleOpened({ id }),
        onAuthor: (id) => AuthorOpened({ id }),
        onCategory: (id) => CategoryOpened({ id }),
        onTag: (articleId, tag) => TagOpened({ articleId, tagName: tag.name }),
        onViewAll: ViewAll(),
      },
      h,
    ),
} as const;

const articles = [
  {
    author: { avatarUrl: agentFace("Olivia Rhye"), href: "#", name: "Olivia Rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    isFeatured: true,
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
      { color: "pink", href: "#", name: "Presentation" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { avatarUrl: agentFace("Phoenix Baker"), href: "#", name: "Phoenix Baker" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "pink", href: "#", name: "Tools" },
      { color: "pink", href: "#", name: "SaaS" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    author: { avatarUrl: agentFace("Lana Steiner"), href: "#", name: "Lana Steiner" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    tags: [
      { color: "success", href: "#", name: "Software Development" },
      { color: "pink", href: "#", name: "Tools" },
    ],
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    author: { avatarUrl: agentFace("Alec Whitten"), href: "#", name: "Alec Whitten" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    tags: [
      { color: "brand", href: "#", name: "Leadership" },
      { color: "slate", href: "#", name: "Management" },
    ],
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
] as const;
const args = {
  articles,
  description: "The latest industry news, interviews, technologies, and resources.",
  heading: "From the blog",
  viewAllLabel: "View all posts",
} as const;

export default {
  ...componentMeta("blog-section-simple-left-aligned-02"),
  title: "Untitled UI/Marketing/Blog/Blog Section Simple Left Aligned 02",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    const article = canvas.getByRole("link", { name: /UX review presentations/u });
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "View all posts" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "All posts opened" })).toBeInTheDocument(),
    );
  },
};
