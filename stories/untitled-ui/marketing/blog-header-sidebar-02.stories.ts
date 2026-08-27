/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and the live browser interaction use the browser promise API. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderSidebar02 } from "../../../src/marketing/blog-header-sidebar-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Article = S.Struct({
  authorAvatarSrc: S.String,
  authorHref: S.String,
  authorName: S.String,
  categoryHref: S.String,
  categoryName: S.String,
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  thumbnailUrl: S.String,
  title: S.String,
});
const Category = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  articles: S.Array(Article),
  categories: S.Array(Category),
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  page: S.Number,
  pageCount: S.Number,
  searchLabel: S.String,
  searchPlaceholder: S.String,
  searchQuery: S.String,
  selectedCategoryId: S.String,
});
type Model = typeof Args.Type;
const ArticleOpened = m("BlogHeaderSidebar02ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogHeaderSidebar02AuthorOpened", { id: S.String });
const CategorySelected = m("BlogHeaderSidebar02CategorySelected", { id: S.String });
const PageSelected = m("BlogHeaderSidebar02PageSelected", { page: S.Number });
const SearchChanged = m("BlogHeaderSidebar02SearchChanged", { query: S.String });
type Message =
  | typeof ArticleOpened.Type
  | typeof AuthorOpened.Type
  | typeof CategorySelected.Type
  | typeof PageSelected.Type
  | typeof SearchChanged.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogHeaderSidebar02ArticleOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, categoryHref: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderSidebar02AuthorOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, authorHref: "#author-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderSidebar02CategorySelected" }, ({ id }) => ({
        ...model,
        selectedCategoryId: id,
      })),
      Match.when({ _tag: "BlogHeaderSidebar02PageSelected" }, ({ page }) => ({ ...model, page })),
      Match.when({ _tag: "BlogHeaderSidebar02SearchChanged" }, ({ query }) => ({
        ...model,
        searchQuery: query,
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogHeaderSidebar02<Message>>[1]) =>
    blogHeaderSidebar02(
      {
        ...model,
        onArticle: (id) => ArticleOpened({ id }),
        onAuthor: (id) => AuthorOpened({ id }),
        onCategory: (id) => CategorySelected({ id }),
        onPage: (page) => PageSelected({ page }),
        onSearch: (query) => SearchChanged({ query }),
      },
      h,
    ),
} as const;

const articles = [
  {
    authorAvatarSrc: agentFace("Olivia Rhye"),
    authorHref: "#olivia-rhye",
    authorName: "Olivia Rhye",
    categoryHref: "#design",
    categoryName: "Design",
    href: "#ux-review-presentations",
    id: "article-1",
    isFeatured: true,
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    authorAvatarSrc: agentFace("Phoenix Baker"),
    authorHref: "#phoenix-baker",
    authorName: "Phoenix Baker",
    categoryHref: "#product",
    categoryName: "Product",
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
    authorAvatarSrc: agentFace("Lana Steiner"),
    authorHref: "#lana-steiner",
    authorName: "Lana Steiner",
    categoryHref: "#software-engineering",
    categoryName: "Software Engineering",
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
    authorAvatarSrc: agentFace("Alec Whitten"),
    authorHref: "#alec-whitten",
    authorName: "Alec Whitten",
    categoryHref: "#product",
    categoryName: "Product",
    href: "#leadership-lessons",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
  {
    authorAvatarSrc: agentFace("Demi Wilkinson"),
    authorHref: "#demi-wilkinson",
    authorName: "Demi Wilkinson",
    categoryHref: "#product",
    categoryName: "Product",
    href: "#mental-models",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    authorAvatarSrc: agentFace("Candice Wu"),
    authorHref: "#candice-wu",
    authorName: "Candice Wu",
    categoryHref: "#design",
    categoryName: "Design",
    href: "#wireframing",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    authorAvatarSrc: agentFace("Natali Craig"),
    authorHref: "#natali-craig",
    authorName: "Natali Craig",
    categoryHref: "#design",
    categoryName: "Design",
    href: "#collaboration",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
  {
    authorAvatarSrc: agentFace("Drew Cano"),
    authorHref: "#drew-cano",
    authorName: "Drew Cano",
    categoryHref: "#product",
    categoryName: "Product",
    href: "#javascript-frameworks",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
  {
    authorAvatarSrc: agentFace("Orlando Diggs"),
    authorHref: "#orlando-diggs",
    authorName: "Orlando Diggs",
    categoryHref: "#customer-success",
    categoryName: "Customer Success",
    href: "#cx-community",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    title: "Podcast: Creating a better CX Community",
  },
] as const;

const args = {
  articles,
  categories: [
    { id: "all", label: "View all" },
    { id: "design", label: "Design" },
    { id: "product", label: "Product" },
    { id: "software-engineering", label: "Software Development" },
    { id: "customer-success", label: "Customer Success" },
    { id: "leadership", label: "Leadership" },
    { id: "management", label: "Management" },
  ],
  description: "The latest industry news, interviews, technologies, and resources.",
  eyebrow: "Our blog",
  heading: "Resources and insights",
  page: 1,
  pageCount: 10,
  searchLabel: "Search",
  searchPlaceholder: "Search",
  searchQuery: "",
  selectedCategoryId: "design",
} as const;

export default {
  ...componentMeta("blog-header-sidebar-02"),
  title: "Untitled UI/Marketing/Blog/Blog Header Sidebar 02",
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
    const search = await canvas.findByRole("searchbox", { name: "Search" });
    await userEvent.type(search, "design");
    await waitFor(() => expect(search).toHaveValue("design"));
    const viewAll = canvas.getByRole("button", { name: "View all" });
    viewAll.focus();
    await expect(viewAll).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(viewAll).toHaveAttribute("aria-current", "page"));
    const article = canvas.getByText("UX review presentations");
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "Page 2" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      ),
    );
  },
};
