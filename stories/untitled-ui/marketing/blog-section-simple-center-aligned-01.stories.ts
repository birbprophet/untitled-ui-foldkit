/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionSimpleCenterAligned01 } from "../../../src/marketing/blog-section-simple-center-aligned-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const BadgeColor = S.Union([
  S.Literal("brand"),
  S.Literal("indigo"),
  S.Literal("pink"),
  S.Literal("sky"),
  S.Literal("success"),
  S.Literal("slate"),
  S.Literal("orange"),
]);
const Tag = S.Struct({ color: BadgeColor, href: S.String, name: S.String });
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
  eyebrow: S.String,
  heading: S.String,
  viewAllLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, viewedAll: S.Boolean });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Article"; id: string }>
  | Readonly<{ _tag: "Author"; id: string }>
  | Readonly<{ _tag: "Category"; id: string }>
  | Readonly<{ _tag: "Tag"; id: string; name: string }>
  | Readonly<{ _tag: "ViewAll" }>;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "ViewAll") {
    return { ...model, viewedAll: true };
  }
  return {
    ...model,
    articles: model.articles.map((article) => {
      if (article.id !== message.id) {
        return article;
      }
      if (message._tag === "Article") {
        return { ...article, href: "#article-opened" };
      }
      if (message._tag === "Author") {
        return { ...article, author: { ...article.author, href: "#author-opened" } };
      }
      if (message._tag === "Category") {
        return { ...article, category: { ...article.category, href: "#category-opened" } };
      }
      return {
        ...article,
        tags: article.tags.map((tag) =>
          tag.name === message.name ? { ...tag, href: "#tag-opened" } : tag,
        ),
      };
    }),
  };
};

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, viewedAll: false }),
  update,
  view: (model: Model, h: Parameters<typeof blogSectionSimpleCenterAligned01<Message>>[1]) =>
    blogSectionSimpleCenterAligned01(
      {
        ...model,
        onArticle: (id): Message => ({ _tag: "Article", id }),
        onAuthor: (id): Message => ({ _tag: "Author", id }),
        onCategory: (id): Message => ({ _tag: "Category", id }),
        onTag: (id, tag): Message => ({ _tag: "Tag", id, name: tag.name }),
        onViewAll: { _tag: "ViewAll" },
        viewAllLabel: model.viewedAll ? "All posts loaded" : model.viewAllLabel,
      },
      h,
    ),
} as const;

const articles = [
  {
    author: { avatarUrl: agentFace("Olivia Rhye"), href: "#olivia", name: "Olivia Rhye" },
    category: { href: "#design", name: "Design" },
    href: "#article-1",
    id: "article-1",
    isFeatured: true,
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: [
      { color: "brand", href: "#design-tag", name: "Design" },
      { color: "indigo", href: "#research", name: "Research" },
      { color: "pink", href: "#presentation", name: "Presentation" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { avatarUrl: agentFace("Phoenix Baker"), href: "#phoenix", name: "Phoenix Baker" },
    category: { href: "#product", name: "Product" },
    href: "#article-2",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    tags: [
      { color: "sky", href: "#product-tag", name: "Product" },
      { color: "pink", href: "#tools", name: "Tools" },
      { color: "pink", href: "#saas", name: "SaaS" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    author: { avatarUrl: agentFace("Lana Steiner"), href: "#lana", name: "Lana Steiner" },
    category: { href: "#engineering", name: "Software Engineering" },
    href: "#article-3",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    tags: [
      { color: "success", href: "#development", name: "Software Development" },
      { color: "pink", href: "#tools", name: "Tools" },
    ],
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
] as const;

const args = {
  articles,
  description: "Interviews, tips, guides, industry best practices, and news.",
  eyebrow: "Latest posts",
  heading: "Siglata blog",
  viewAllLabel: "View all posts",
} as const;

export default {
  ...componentMeta("blog-section-simple-center-aligned-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Simple Center Aligned 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof blogSectionSimpleCenterAligned01<Message>>[1]) =>
      h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    const title = await canvas.findByText("UX review presentations");
    const articleLink = title.closest("a") ?? title;
    await userEvent.click(articleLink);
    await waitFor(() => expect(articleLink).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "View all posts" }));
    await expect(
      await canvas.findByRole("button", { name: "All posts loaded" }),
    ).toBeInTheDocument();
  },
};
