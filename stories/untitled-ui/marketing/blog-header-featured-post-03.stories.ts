/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderFeaturedPost03 } from "../../../../../packages/ui/src/marketing/blog-header-featured-post-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

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
  authorName: S.String,
  categoryHref: S.String,
  categoryName: S.String,
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  tags: S.Array(Tag),
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  page: S.Number,
  privacyHref: S.String,
  subscribeLabel: S.String,
  totalPages: S.Number,
});
const Model = S.Struct({ ...Args.fields, email: S.String, isSubmitted: S.Boolean });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Article"; id: string }>
  | Readonly<{ _tag: "Email"; email: string }>
  | Readonly<{ _tag: "Page"; page: number }>
  | Readonly<{ _tag: "Subscribe" }>;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, email: "", isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Email") {
      return { ...model, email: message.email };
    }
    if (message._tag === "Page") {
      return { ...model, page: message.page };
    }
    if (message._tag === "Subscribe") {
      return { ...model, isSubmitted: true };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id ? { ...article, categoryHref: "#article-opened" } : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderFeaturedPost03<Message>>[1]) =>
    blogHeaderFeaturedPost03(
      {
        ...model,
        onArticle: (id): Message => ({ _tag: "Article", id }),
        onEmailInput: (email): Message => ({ _tag: "Email", email }),
        onPage: (page): Message => ({ _tag: "Page", page }),
        onSubscribe: { _tag: "Subscribe" },
        subscribeLabel: model.isSubmitted ? "Subscribed" : model.subscribeLabel,
      },
      h,
    ),
} as const;

const articles = [
  {
    authorName: "Olivia Rhye",
    categoryHref: "#",
    categoryName: "Design",
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
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
    authorName: "Phoenix Baker",
    categoryHref: "#",
    categoryName: "Product",
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
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
    authorName: "Lana Steiner",
    categoryHref: "#",
    categoryName: "Software Engineering",
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
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
    authorName: "Alec Whitten",
    categoryHref: "#",
    categoryName: "Product",
    href: "#",
    id: "article-3-5",
    publishedAt: "17 Jan 2027",
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
    authorName: "Demi Wilkinson",
    categoryHref: "#",
    categoryName: "Product",
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
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
    authorName: "Candice Wu",
    categoryHref: "#",
    categoryName: "Design",
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    authorName: "Natali Craig",
    categoryHref: "#",
    categoryName: "Design",
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
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
  description: "The latest industry news, interviews, technologies, and resources.",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Our blog",
  heading: "Resources and insights",
  page: 1,
  privacyHref: "#",
  subscribeLabel: "Get started",
  totalPages: 10,
} as const;

export default {
  ...componentMeta("blog-header-featured-post-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Featured Post 03",
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
    const email = await canvas.findByRole("textbox", { name: "Email" });
    await userEvent.type(email, "olivia@example.com");
    await expect(email).toHaveValue("olivia@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await expect(await canvas.findByRole("button", { name: "Subscribed" })).toBeInTheDocument();
    const article = canvas.getByRole("link", { name: /UX review presentations/u });
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "Go to next page" }));
    await expect(canvas.getByText("Page 2 of 10")).toBeInTheDocument();
  },
};
