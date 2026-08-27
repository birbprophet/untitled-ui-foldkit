/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/avoid-direct-tag-checks -- Storybook exercises the controlled full section in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderSidebar01 } from "../../../src/marketing/blog-header-sidebar-01.ts";
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
const Category = S.Struct({ href: S.String, id: S.String, label: S.String });
const Args = S.Struct({
  activeCategoryId: S.String,
  articles: S.Array(Article),
  categories: S.Array(Category),
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  page: S.Number,
  privacyHref: S.String,
  privacyLabel: S.String,
  query: S.String,
  searchLabel: S.String,
  subscribeLabel: S.String,
});
type Model = typeof Args.Type;
const ArticleOpened = m("BlogHeaderSidebar01ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogHeaderSidebar01AuthorOpened", { id: S.String });
const CategorySelected = m("BlogHeaderSidebar01CategorySelected", { id: S.String });
const EmailInput = m("BlogHeaderSidebar01EmailInput", { email: S.String });
const PageChanged = m("BlogHeaderSidebar01PageChanged", { page: S.Number });
const SearchInput = m("BlogHeaderSidebar01SearchInput", { query: S.String });
const Subscribed = m("BlogHeaderSidebar01Subscribed");
type Message =
  | typeof ArticleOpened.Type
  | typeof AuthorOpened.Type
  | typeof CategorySelected.Type
  | typeof EmailInput.Type
  | typeof PageChanged.Type
  | typeof SearchInput.Type
  | typeof Subscribed.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogHeaderSidebar01EmailInput") {
      return { ...model, email: message.email };
    }
    if (message._tag === "BlogHeaderSidebar01SearchInput") {
      return { ...model, query: message.query };
    }
    if (message._tag === "BlogHeaderSidebar01CategorySelected") {
      return { ...model, activeCategoryId: message.id };
    }
    if (message._tag === "BlogHeaderSidebar01PageChanged") {
      return { ...model, page: message.page };
    }
    if (message._tag === "BlogHeaderSidebar01Subscribed") {
      return { ...model, subscribeLabel: "Subscribed" };
    }
    if (message._tag === "BlogHeaderSidebar01AuthorOpened") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? { ...article, author: { ...article.author, href: "#author-opened" } }
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
  view: (model: Model, h: Parameters<typeof blogHeaderSidebar01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderSidebar01(
          {
            ...model,
            onArticle: (id) => ArticleOpened({ id }),
            onAuthor: (id) => AuthorOpened({ id }),
            onCategorySelect: (id) => CategorySelected({ id }),
            onEmailInput: (email) => EmailInput({ email }),
            onPageChange: (page) => PageChanged({ page }),
            onSearchInput: (query) => SearchInput({ query }),
            onSubscribe: Subscribed(),
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
    category: { href: "#software-development", name: "Software Development" },
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
    author: { href: "#alec-whitten", name: "Alec Whitten" },
    category: { href: "#product", name: "Product" },
    href: "#leadership-lessons",
    id: "article-3-5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
  {
    author: { href: "#demi-wilkinson", name: "Demi Wilkinson" },
    category: { href: "#product", name: "Product" },
    href: "#mental-models",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
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
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    author: { href: "#natali-craig", name: "Natali Craig" },
    category: { href: "#design", name: "Design" },
    href: "#collaboration",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
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
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
] as const;
const categories = [
  { href: "#all", id: "all", label: "View all" },
  { href: "#design", id: "design", label: "Design" },
  { href: "#product", id: "product", label: "Product" },
  { href: "#software-development", id: "software-development", label: "Software Development" },
  { href: "#customer-success", id: "customer-success", label: "Customer Success" },
  { href: "#leadership", id: "leadership", label: "Leadership" },
  { href: "#management", id: "management", label: "Management" },
] as const;
const args = {
  activeCategoryId: "all",
  articles,
  categories,
  description: "Tools and strategies modern teams need to help their companies grow.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Resources",
  heading: "Siglata blog",
  page: 1,
  privacyHref: "#privacy",
  privacyLabel: "privacy policy",
  query: "",
  searchLabel: "Search",
  subscribeLabel: "Get started",
} as const;

export default {
  ...componentMeta("blog-header-sidebar-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Sidebar 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, activeCategoryId: "design", email: "reader@example.com", query: "design" },
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
    const email = await canvas.findByRole("textbox", { name: "Email" });
    await userEvent.type(email, "reader@example.com");
    await expect(email).toHaveValue("reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Subscribed" })).toBeInTheDocument(),
    );
    const search = canvas.getByRole("searchbox", { name: "Search" });
    await userEvent.type(search, "design");
    await expect(search).toHaveValue("design");
    const categoryNav = canvas.getByRole("navigation", { name: "Blog categories" });
    await userEvent.click(within(categoryNav).getByRole("link", { name: "Design" }));
    await waitFor(() =>
      expect(
        within(categoryNav).getByRole("link", { current: "page", name: "Design" }),
      ).toBeInTheDocument(),
    );
    const article = canvas.getByRole("link", { name: "Read post" });
    await userEvent.click(article);
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "Read post" })).toHaveAttribute(
        "href",
        "#article-opened",
      ),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Page 2" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { current: "page", name: "Page 2" })).toBeInTheDocument(),
    );
  },
};
