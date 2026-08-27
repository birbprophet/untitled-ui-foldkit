/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/avoid-direct-tag-checks, unicorn/no-nested-ternary -- Storybook CSF and browser interactions use promise APIs. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderSimple05 } from "../../../src/marketing/blog-header-simple-05.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Category = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
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
  selectedCategoryId: S.String,
  subscribeDesktopLabel: S.String,
  subscribeMobileLabel: S.String,
  totalPages: S.Number,
});
const Model = S.Struct({ ...Args.fields, isSubmitted: S.Boolean });
type Model = typeof Model.Type;
const ArticleSelected = m("BlogHeaderSimple05ArticleSelected", { id: S.String });
const AuthorSelected = m("BlogHeaderSimple05AuthorSelected", { id: S.String });
const CategorySelected = m("BlogHeaderSimple05CategorySelected", { id: S.String });
const EmailChanged = m("BlogHeaderSimple05EmailChanged", { email: S.String });
const PageSelected = m("BlogHeaderSimple05PageSelected", { page: S.Number });
const Subscribe = m("BlogHeaderSimple05Subscribe", {});
type Message =
  | typeof ArticleSelected.Type
  | typeof AuthorSelected.Type
  | typeof CategorySelected.Type
  | typeof EmailChanged.Type
  | typeof PageSelected.Type
  | typeof Subscribe.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogHeaderSimple05CategorySelected") {
      return { ...model, selectedCategoryId: message.id };
    }
    if (message._tag === "BlogHeaderSimple05EmailChanged") {
      return { ...model, email: message.email };
    }
    if (message._tag === "BlogHeaderSimple05PageSelected") {
      return { ...model, page: message.page };
    }
    if (message._tag === "BlogHeaderSimple05Subscribe") {
      return { ...model, isSubmitted: true };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id
          ? message._tag === "BlogHeaderSimple05AuthorSelected"
            ? { ...article, author: { ...article.author, href: "#author-opened" } }
            : {
                ...article,
                category: { ...article.category, href: "#article-opened" },
                href: "#article-opened",
              }
          : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderSimple05<Message>>[1]) =>
    blogHeaderSimple05(
      {
        ...model,
        onArticle: (id) => ArticleSelected({ id }),
        onAuthor: (id) => AuthorSelected({ id }),
        onCategorySelect: (id) => CategorySelected({ id }),
        onEmailInput: (email) => EmailChanged({ email }),
        onPage: (page) => PageSelected({ page }),
        onSubscribe: Subscribe(),
        subscribeDesktopLabel: model.isSubmitted ? "Subscribed" : model.subscribeDesktopLabel,
        subscribeMobileLabel: model.isSubmitted ? "Subscribed" : model.subscribeMobileLabel,
      },
      h,
    ),
} as const;

const categories = [
  { id: "all", label: "View all" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "customer-success", label: "Customer Success" },
] as const;

const articles = [
  {
    author: { href: "#", name: "Olivia Rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    author: { href: "#", name: "Phoenix Baker" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    author: { href: "#", name: "Lana Steiner" },
    category: { href: "#", name: "Software Engineering" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    author: { href: "#", name: "Alec Whitten" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
  {
    author: { href: "#", name: "Demi Wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    author: { href: "#", name: "Candice Wu" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    author: { href: "#", name: "Natali Craig" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
  {
    author: { href: "#", name: "Drew Cano" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
] as const;

const args = {
  articles,
  categories,
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Blog",
  heading: "Resource library",
  page: 1,
  privacyHref: "#",
  selectedCategoryId: "all",
  subscribeDesktopLabel: "Get started",
  subscribeMobileLabel: "Subscribe",
  totalPages: 10,
} as const;

export default {
  ...componentMeta("blog-header-simple-05"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 05",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "reader@example.com", page: 2, selectedCategoryId: "design" },
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

    const design = canvas.getByRole("tab", { name: "Design" });
    await userEvent.click(design);
    await expect(design).toHaveAttribute("aria-selected", "true");

    const article = canvas
      .getAllByRole("link", { name: "UX review presentations" })
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
