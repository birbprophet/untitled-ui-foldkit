/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import * as Match from "effect/Match";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderAltLayout04 } from "../../../../../packages/ui/src/marketing/blog-header-alt-layout-04.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Article = S.Struct({
  author: S.Struct({ href: S.String, name: S.String, seed: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  thumbnailSeed: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  currentPage: S.Number,
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  privacyCopy: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  submitLabel: S.String,
  totalPages: S.Number,
});
type Model = typeof Args.Type;
const ArticleOpened = m("BlogHeaderAltLayout04ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogHeaderAltLayout04AuthorOpened", { id: S.String });
const CategoryOpened = m("BlogHeaderAltLayout04CategoryOpened", { id: S.String });
const EmailChanged = m("BlogHeaderAltLayout04EmailChanged", { email: S.String });
const PageChanged = m("BlogHeaderAltLayout04PageChanged", { page: S.Number });
const PrivacyOpened = m("BlogHeaderAltLayout04PrivacyOpened");
const Submitted = m("BlogHeaderAltLayout04Submitted");
type Message =
  | typeof ArticleOpened.Type
  | typeof AuthorOpened.Type
  | typeof CategoryOpened.Type
  | typeof EmailChanged.Type
  | typeof PageChanged.Type
  | typeof PrivacyOpened.Type
  | typeof Submitted.Type;

const update = (model: Model, message: Message): Model =>
  Match.value(message).pipe(
    Match.when({ _tag: "BlogHeaderAltLayout04ArticleOpened" }, ({ id }) => ({
      ...model,
      articles: model.articles.map((article) =>
        article.id === id ? { ...article, href: "#article-opened" } : article,
      ),
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04AuthorOpened" }, ({ id }) => ({
      ...model,
      articles: model.articles.map((article) =>
        article.id === id
          ? { ...article, author: { ...article.author, href: "#author-opened" } }
          : article,
      ),
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04CategoryOpened" }, ({ id }) => ({
      ...model,
      articles: model.articles.map((article) =>
        article.id === id
          ? { ...article, category: { ...article.category, href: "#category-opened" } }
          : article,
      ),
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04EmailChanged" }, ({ email }) => ({
      ...model,
      email,
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04PageChanged" }, ({ page }) => ({
      ...model,
      currentPage: page,
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04PrivacyOpened" }, () => ({
      ...model,
      privacyHref: "#privacy-opened",
    })),
    Match.when({ _tag: "BlogHeaderAltLayout04Submitted" }, () => ({
      ...model,
      submitLabel: "Subscribed",
    })),
    Match.exhaustive,
  );

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update,
  view: (model: Model, h: Parameters<typeof blogHeaderAltLayout04<Message>>[1]) =>
    blogHeaderAltLayout04(
      {
        ...model,
        messageForArticle: (id) => ArticleOpened({ id }),
        messageForAuthor: (id) => AuthorOpened({ id }),
        messageForCategory: (id) => CategoryOpened({ id }),
        messageForPage: (page) => PageChanged({ page }),
        onEmailInput: (email) => EmailChanged({ email }),
        onPrivacyPolicy: PrivacyOpened(),
        onSubmit: Submitted(),
      },
      h,
    ),
} as const;

const articles = [
  {
    author: { href: "#", name: "Olivia Rhye", seed: "blog-alt-04-olivia" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailSeed: "blog-alt-04-spirals",
    title: "UX review presentations",
  },
  {
    author: { href: "#", name: "Phoenix Baker", seed: "blog-alt-04-phoenix" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailSeed: "blog-alt-04-conversation",
    title: "Migrating to Linear 101",
  },
  {
    author: { href: "#", name: "Lana Steiner", seed: "blog-alt-04-lana" },
    category: { href: "#", name: "Software Engineering" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailSeed: "blog-alt-04-api-stack",
    title: "Building your API stack",
  },
  {
    author: { href: "#", name: "Alec Whitten", seed: "blog-alt-04-alec" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    thumbnailSeed: "blog-alt-04-leadership",
    title: "Bill Walsh leadership lessons",
  },
  {
    author: { href: "#", name: "Demi Wilkinson", seed: "blog-alt-04-demi" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailSeed: "blog-alt-04-mental-models",
    title: "PM mental models",
  },
  {
    author: { href: "#", name: "Candice Wu", seed: "blog-alt-04-candice" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailSeed: "blog-alt-04-wireframing",
    title: "What is wireframing?",
  },
  {
    author: { href: "#", name: "Natali Craig", seed: "blog-alt-04-natali" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailSeed: "blog-alt-04-collaboration",
    title: "How collaboration makes us better designers",
  },
  {
    author: { href: "#", name: "Drew Cano", seed: "blog-alt-04-drew" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailSeed: "blog-alt-04-frameworks",
    title: "Our top 10 Javascript frameworks to use",
  },
  {
    author: { href: "#", name: "Orlando Diggs", seed: "blog-alt-04-orlando" },
    category: { href: "#", name: "Customer Success" },
    href: "#",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    thumbnailSeed: "blog-alt-04-community",
    title: "Podcast: Creating a better CX Community",
  },
] as const;

const args = {
  articles,
  currentPage: 1,
  description: "Tool and strategies modern teams need to help their companies grow.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Resources",
  heading: "Siglata blog",
  privacyCopy: "We care about your data in our",
  privacyHref: "#",
  privacyLabel: "privacy policy",
  submitLabel: "Get started",
  totalPages: 10,
} as const;

export default {
  ...componentMeta("blog-header-alt-layout-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Alt Layout 04",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { ...args, currentPage: 5 } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [
          blogHeaderAltLayout04(
            {
              ...model,
              messageForArticle: (id) => ArticleOpened({ id }),
              messageForAuthor: (id) => AuthorOpened({ id }),
              messageForCategory: (id) => CategoryOpened({ id }),
              messageForPage: (page) => PageChanged({ page }),
              onEmailInput: (email) => EmailChanged({ email }),
              onPrivacyPolicy: PrivacyOpened(),
              onSubmit: Submitted(),
            },
            h,
          ),
        ],
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
    const email = await canvas.findByRole("textbox", { name: args.emailLabel });
    await userEvent.type(email, "operator@siglata.com");
    await expect(email).toHaveValue("operator@siglata.com");
    await userEvent.click(canvas.getByRole("button", { name: args.submitLabel }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Subscribed" })).toBeInTheDocument(),
    );

    const category = canvas.getByRole("link", { name: "UX review presentations" });
    await userEvent.click(category);
    await waitFor(() => expect(category).toHaveAttribute("href", "#category-opened"));

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      ),
    );
  },
};
