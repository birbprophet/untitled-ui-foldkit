/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/prefer-destructuring, mps/avoid-direct-tag-checks -- Storybook exercises controlled carousel state in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionCarouselLayout01 } from "../../../src/marketing/blog-section-carousel-layout-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  nextLabel: S.String,
  previousLabel: S.String,
  viewAllHref: S.String,
  viewAllLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, activeIndex: S.Number });
type Model = typeof Model.Type;
const ArticleOpened = m("BlogSectionCarouselLayout01ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogSectionCarouselLayout01AuthorOpened", { id: S.String });
const CategoryOpened = m("BlogSectionCarouselLayout01CategoryOpened", { id: S.String });
const Next = m("BlogSectionCarouselLayout01Next");
const Previous = m("BlogSectionCarouselLayout01Previous");
const ViewAll = m("BlogSectionCarouselLayout01ViewAll");
type Message =
  | typeof ArticleOpened.Type
  | typeof AuthorOpened.Type
  | typeof CategoryOpened.Type
  | typeof Next.Type
  | typeof Previous.Type
  | typeof ViewAll.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, activeIndex: 0 }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogSectionCarouselLayout01Next") {
      return { ...model, activeIndex: Math.min(model.articles.length - 1, model.activeIndex + 1) };
    }
    if (message._tag === "BlogSectionCarouselLayout01Previous") {
      return { ...model, activeIndex: Math.max(0, model.activeIndex - 1) };
    }
    if (message._tag === "BlogSectionCarouselLayout01ViewAll") {
      return { ...model, viewAllHref: "#all-posts-opened" };
    }
    if (message._tag === "BlogSectionCarouselLayout01AuthorOpened") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? { ...article, author: { ...article.author, href: "#author-opened" } }
            : article,
        ),
      };
    }
    if (message._tag === "BlogSectionCarouselLayout01CategoryOpened") {
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
        article.id === message.id ? { ...article, href: "#article-opened" } : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogSectionCarouselLayout01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogSectionCarouselLayout01(
          {
            ...model,
            onArticle: (id) => ArticleOpened({ id }),
            onAuthor: (id) => AuthorOpened({ id }),
            onCategory: (id) => CategoryOpened({ id }),
            onNext: Next(),
            onPrevious: Previous(),
            onViewAll: ViewAll(),
          },
          h,
        ),
      ],
    ),
} as const;

const articles = [
  {
    author: { href: "#olivia-rhye", name: "Olivia Rhye" },
    category: { href: "#design", name: "Design" },
    href: "#ux-review-presentations",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { href: "#phoenix-baker", name: "Phoenix Baker" },
    category: { href: "#product", name: "Product" },
    href: "#migrating-to-linear",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    author: { href: "#lana-steiner", name: "Lana Steiner" },
    category: { href: "#software-engineering", name: "Software Engineering" },
    href: "#api-stack",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    author: { href: "#demi-wilkinson", name: "Demi Wilkinson" },
    category: { href: "#product", name: "Product" },
    href: "#pm-mental-models-one",
    id: "article-3-5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "PM mental models",
  },
  {
    author: { href: "#demi-wilkinson", name: "Demi Wilkinson" },
    category: { href: "#product", name: "Product" },
    href: "#pm-mental-models-two",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/brainstorming.webp",
    title: "PM mental models",
  },
  {
    author: { href: "#candice-wu", name: "Candice Wu" },
    category: { href: "#design", name: "Design" },
    href: "#wireframing",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-4.webp",
    title: "What is Wireframing?",
  },
  {
    author: { href: "#natali-craig", name: "Natali Craig" },
    category: { href: "#design", name: "Design" },
    href: "#collaboration",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/collaboration.webp",
    title: "How collaboration makes us better designers",
  },
  {
    author: { href: "#drew-cano", name: "Drew Cano" },
    category: { href: "#product", name: "Product" },
    href: "#javascript-frameworks",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailUrl: "https://www.untitledui.com/marketing/man-and-laptop-2.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
  {
    author: { href: "#orlando-diggs", name: "Orlando Diggs" },
    category: { href: "#customer-success", name: "Customer Success" },
    href: "#cx-community",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    thumbnailUrl: "https://www.untitledui.com/marketing/podcast-girl-2.webp",
    title: "Podcast: Creating a better CX Community",
  },
] as const;
const args = {
  articles,
  description: "Interviews, tips, guides, industry best practices, and news.",
  eyebrow: "Latest posts",
  heading: "Siglata blog",
  nextLabel: "Next slide",
  previousLabel: "Previous slide",
  viewAllHref: "#all-posts",
  viewAllLabel: "View all posts",
} as const;

export default {
  ...componentMeta("blog-section-carousel-layout-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Carousel Layout 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
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
    const previous = await canvas.findByRole("button", { name: "Previous slide" });
    const next = canvas.getByRole("button", { name: "Next slide" });
    await expect(previous).toBeDisabled();
    await userEvent.click(next);
    await waitFor(() => expect(previous).toBeEnabled());
    const carousel = canvas.getByRole("region", { name: "Latest posts" });
    carousel.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(previous).toBeEnabled();
    const article = canvas.getAllByRole("link", { name: "Read post" })[0];
    await userEvent.click(article);
    await waitFor(() =>
      expect(canvas.getAllByRole("link", { name: "Read post" })[0]).toHaveAttribute(
        "href",
        "#article-opened",
      ),
    );
    const viewAll = canvas.getAllByRole("link", { name: "View all posts" })[0];
    await userEvent.click(viewAll);
    await waitFor(() =>
      expect(canvas.getAllByRole("link", { name: "View all posts" })[0]).toHaveAttribute(
        "href",
        "#all-posts-opened",
      ),
    );
  },
};
