/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderSimple01 } from "../../../src/marketing/blog-header-simple-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Option = S.Struct({ id: S.String, label: S.String });
const Article = S.Struct({
  authorHref: S.String,
  authorName: S.String,
  avatarUrl: S.String,
  category: S.String,
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  categories: S.Array(Option),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  newsletterDescription: S.String,
  newsletterEmail: S.String,
  newsletterPrivacyHref: S.String,
  newsletterTitle: S.String,
  page: S.Number,
  pageCount: S.Number,
  query: S.String,
  selectedCategory: S.String,
  sortBy: S.String,
  sortOptions: S.Array(Option),
});
type Model = typeof Args.Type;
const ArticleSelected = m("BlogHeaderSimple01ArticleSelected", { id: S.String });
const AuthorSelected = m("BlogHeaderSimple01AuthorSelected", { id: S.String });
const CategorySelected = m("BlogHeaderSimple01CategorySelected", { id: S.String });
const NewsletterEmailChanged = m("BlogHeaderSimple01NewsletterEmailChanged", { email: S.String });
const NewsletterSubscribed = m("BlogHeaderSimple01NewsletterSubscribed");
const PageSelected = m("BlogHeaderSimple01PageSelected", { page: S.Number });
const SearchChanged = m("BlogHeaderSimple01SearchChanged", { query: S.String });
const SortSelected = m("BlogHeaderSimple01SortSelected", { id: S.String });
type Message =
  | typeof ArticleSelected.Type
  | typeof AuthorSelected.Type
  | typeof CategorySelected.Type
  | typeof NewsletterEmailChanged.Type
  | typeof NewsletterSubscribed.Type
  | typeof PageSelected.Type
  | typeof SearchChanged.Type
  | typeof SortSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogHeaderSimple01ArticleSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, href: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderSimple01AuthorSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, authorHref: "#author-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderSimple01CategorySelected" }, ({ id }) => ({
        ...model,
        selectedCategory: id,
      })),
      Match.when({ _tag: "BlogHeaderSimple01NewsletterEmailChanged" }, ({ email }) => ({
        ...model,
        newsletterEmail: email,
      })),
      Match.when({ _tag: "BlogHeaderSimple01NewsletterSubscribed" }, () => ({
        ...model,
        newsletterEmail: "subscribed@example.com",
      })),
      Match.when({ _tag: "BlogHeaderSimple01PageSelected" }, ({ page }) => ({ ...model, page })),
      Match.when({ _tag: "BlogHeaderSimple01SearchChanged" }, ({ query }) => ({ ...model, query })),
      Match.when({ _tag: "BlogHeaderSimple01SortSelected" }, ({ id }) => ({
        ...model,
        sortBy: id,
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogHeaderSimple01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderSimple01(
          {
            ...model,
            onArticle: (id) => ArticleSelected({ id }),
            onAuthor: (id) => AuthorSelected({ id }),
            onCategory: (id) => CategorySelected({ id }),
            onNewsletterEmail: (email) => NewsletterEmailChanged({ email }),
            onNewsletterSubscribe: NewsletterSubscribed(),
            onPage: (page) => PageSelected({ page }),
            onSearch: (query) => SearchChanged({ query }),
            onSort: (id) => SortSelected({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const articles = [
  {
    authorHref: "#",
    authorName: "Olivia Rhye",
    avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    category: "Design",
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    authorHref: "#",
    authorName: "Phoenix Baker",
    avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    category: "Product",
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    authorHref: "#",
    authorName: "Lana Steiner",
    avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    category: "Software Engineering",
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    authorHref: "#",
    authorName: "Demi Wilkinson",
    avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    category: "Product",
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    authorHref: "#",
    authorName: "Candice Wu",
    avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
    category: "Design",
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    authorHref: "#",
    authorName: "Natali Craig",
    avatarUrl: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80",
    category: "Design",
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
] as const;
const args = {
  articles,
  categories: [
    { id: "all", label: "View all" },
    { id: "design", label: "Design" },
    { id: "product", label: "Product" },
    { id: "software-engineering", label: "Software Engineering" },
    { id: "customer-success", label: "Customer Success" },
  ],
  description: "The latest industry news, interviews, technologies, and resources.",
  eyebrow: "Our blog",
  heading: "The latest writings from our team",
  newsletterDescription:
    "No spam. Just the latest releases and tips, interesting articles, and exclusive interviews in your inbox every week.",
  newsletterEmail: "",
  newsletterPrivacyHref: "#",
  newsletterTitle: "Weekly newsletter",
  page: 1,
  pageCount: 10,
  query: "",
  selectedCategory: "all",
  sortBy: "recent",
  sortOptions: [
    { id: "recent", label: "Most recent" },
    { id: "popular", label: "Most popular" },
    { id: "viewed", label: "Most viewed" },
  ],
} as const;

export default {
  ...componentMeta("blog-header-simple-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 01",
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
    const search = canvas.getByRole("searchbox", { name: "Search" });
    await userEvent.type(search, "design");
    await waitFor(() => expect(search).toHaveValue("design"));
    await userEvent.click(canvas.getByRole("button", { name: "Design" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Design" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Sort by" }), "popular");
    await waitFor(() =>
      expect(canvas.getByRole("combobox", { name: "Sort by" })).toHaveValue("popular"),
    );
    const email = canvas.getByRole("textbox", { name: "Newsletter email address" });
    await userEvent.type(email, "reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));
    await waitFor(() => expect(email).toHaveValue("subscribed@example.com"));
  },
};
