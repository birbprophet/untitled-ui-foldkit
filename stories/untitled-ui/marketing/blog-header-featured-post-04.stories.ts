/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and browser interactions use promise APIs. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderFeaturedPost04 } from "../../../src/marketing/blog-header-featured-post-04.ts";
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
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  featuredArticle: Article,
  heading: S.String,
  page: S.Number,
  privacyHref: S.String,
  subscribeLabel: S.String,
  totalPages: S.Number,
});
const Model = S.Struct({ ...Args.fields, isSubmitted: S.Boolean });
type Model = typeof Model.Type;
const ArticleSelected = m("BlogHeaderFeaturedPost04ArticleSelected", { id: S.String });
const EmailChanged = m("BlogHeaderFeaturedPost04EmailChanged", { email: S.String });
const PageSelected = m("BlogHeaderFeaturedPost04PageSelected", { page: S.Number });
const Subscribe = m("BlogHeaderFeaturedPost04Subscribe", {});
const TagSelected = m("BlogHeaderFeaturedPost04TagSelected", {
  articleId: S.String,
  tagName: S.String,
});
type Message =
  | typeof ArticleSelected.Type
  | typeof EmailChanged.Type
  | typeof PageSelected.Type
  | typeof Subscribe.Type
  | typeof TagSelected.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogHeaderFeaturedPost04EmailChanged") {
      return { ...model, email: message.email };
    }
    if (message._tag === "BlogHeaderFeaturedPost04PageSelected") {
      return { ...model, page: message.page };
    }
    if (message._tag === "BlogHeaderFeaturedPost04Subscribe") {
      return { ...model, isSubmitted: true };
    }
    if (message._tag === "BlogHeaderFeaturedPost04TagSelected") {
      return model;
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id
          ? { ...article, category: { ...article.category, href: "#article-opened" } }
          : article,
      ),
      featuredArticle:
        model.featuredArticle.id === message.id
          ? {
              ...model.featuredArticle,
              category: { ...model.featuredArticle.category, href: "#article-opened" },
            }
          : model.featuredArticle,
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderFeaturedPost04<Message>>[1]) =>
    blogHeaderFeaturedPost04(
      {
        ...model,
        onArticle: (id) => ArticleSelected({ id }),
        onEmailInput: (email) => EmailChanged({ email }),
        onPage: (page) => PageSelected({ page }),
        onSubscribe: Subscribe(),
        onTag: (articleId, tagName) => TagSelected({ articleId, tagName }),
        subscribeLabel: model.isSubmitted ? "Subscribed" : model.subscribeLabel,
      },
      h,
    ),
} as const;

const featuredArticle = {
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
  thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
  title: "UX review presentations",
} as const;

const articles = [
  {
    author: { avatarUrl: agentFace("Phoenix Baker"), href: "#", name: "Phoenix Baker" },
    category: { href: "#", name: "Product" },
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
    category: { href: "#", name: "Software Engineering" },
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
    category: { href: "#", name: "Product" },
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
  {
    author: { avatarUrl: agentFace("Demi Wilkinson"), href: "#", name: "Demi Wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "indigo", href: "#", name: "Research" },
      { color: "orange", href: "#", name: "Frameworks" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    author: { avatarUrl: agentFace("Candice Wu"), href: "#", name: "Candice Wu" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    author: { avatarUrl: agentFace("Natali Craig"), href: "#", name: "Natali Craig" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
] as const;

const args = {
  articles,
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Blog",
  featuredArticle,
  heading: "Resource library",
  page: 1,
  privacyHref: "#",
  subscribeLabel: "Get started",
  totalPages: 10,
} as const;

export default {
  ...componentMeta("blog-header-featured-post-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Featured Post 04",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "reader@example.com", page: 2 },
};
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
    const email = await canvas.findByRole("textbox", { name: "Email" });
    await userEvent.type(email, "reader@example.com");
    await expect(email).toHaveValue("reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await expect(await canvas.findByRole("button", { name: "Subscribed" })).toBeInTheDocument();

    const article = canvas
      .getAllByRole("link", { name: /UX review presentations/u })
      .find((link) => link.getAttribute("tabindex") !== "-1");
    await expect(article).toBeDefined();
    if (article === undefined) {
      return;
    }
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
