/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderFeaturedPost01 } from "../../../src/marketing/blog-header-featured-post-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const LinkLabel = S.Struct({ href: S.String, name: S.String });
const Author = S.Struct({ avatarUrl: S.String, href: S.String, name: S.String });
const Article = S.Struct({
  author: Author,
  category: LinkLabel,
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  tags: S.Array(LinkLabel),
  thumbnailUrl: S.String,
  title: S.String,
});
const Option = S.Struct({ id: S.String, label: S.String });
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  eyebrow: S.String,
  featuredArticle: Article,
  heading: S.String,
  pageCount: S.Number,
  sortLabel: S.String,
  sortOptions: S.Array(Option),
  tabs: S.Array(Option),
});
const Model = S.Struct({
  ...Args.fields,
  page: S.Number,
  selectedSort: S.String,
  selectedTab: S.String,
});
type Model = typeof Model.Type;
const ArticleOpened = m("BlogHeaderFeaturedPost01ArticleOpened", { id: S.String });
const PageSelected = m("BlogHeaderFeaturedPost01PageSelected", { page: S.Number });
const SortSelected = m("BlogHeaderFeaturedPost01SortSelected", { id: S.String });
const TabSelected = m("BlogHeaderFeaturedPost01TabSelected", { id: S.String });
type Message =
  | typeof ArticleOpened.Type
  | typeof PageSelected.Type
  | typeof SortSelected.Type
  | typeof TabSelected.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    ...args,
    page: 1,
    selectedSort: "recent",
    selectedTab: "all",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogHeaderFeaturedPost01TabSelected") {
      return { ...model, selectedTab: message.id };
    }
    if (message._tag === "BlogHeaderFeaturedPost01SortSelected") {
      return { ...model, selectedSort: message.id };
    }
    if (message._tag === "BlogHeaderFeaturedPost01PageSelected") {
      return { ...model, page: message.page };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id ? { ...article, href: "#article-opened" } : article,
      ),
      featuredArticle:
        model.featuredArticle.id === message.id
          ? { ...model.featuredArticle, href: "#article-opened" }
          : model.featuredArticle,
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderFeaturedPost01<Message>>[1]) =>
    blogHeaderFeaturedPost01(
      {
        ...model,
        onArticle: (id) => ArticleOpened({ id }),
        onPage: (page) => PageSelected({ page }),
        onSort: (id) => SortSelected({ id }),
        onTab: (id) => TabSelected({ id }),
      },
      h,
    ),
} as const;

const article = (
  id: string,
  title: string,
  summary: string,
  category: string,
  thumbnailUrl: string,
  publishedAt: string,
  author: string,
) => ({
  author: { avatarUrl: agentFace(author), href: "#author", name: author },
  category: { href: "#category", name: category },
  href: "#",
  id,
  publishedAt,
  readingTime: "8 min read",
  summary,
  tags: [{ href: "#tag", name: category }],
  thumbnailUrl,
  title,
});

const featuredArticle = {
  ...article(
    "article-001",
    'Improve your design skills: Develop an "eye" for design',
    'Tools and trends change, but good design is timeless. Learn how to quickly develop an "eye" for design.',
    "Design",
    "https://www.untitledui.com/marketing/blog-featured-post-01.webp",
    "10 April 2027",
    "Amélie Laurent",
  ),
  tags: [
    { href: "#design", name: "Design" },
    { href: "#research", name: "Research" },
    { href: "#presentation", name: "Presentation" },
  ],
};
const articles = [
  article(
    "article-1",
    "UX review presentations",
    "How do you create compelling presentations that wow your colleagues and impress your managers?",
    "Design",
    "https://www.untitledui.com/marketing/spirals.webp",
    "20 Jan 2027",
    "Olivia Rhye",
  ),
  article(
    "article-2",
    "Migrating to Linear 101",
    "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    "Product",
    "https://www.untitledui.com/marketing/conversation.webp",
    "19 Jan 2027",
    "Phoenix Baker",
  ),
  article(
    "article-3",
    "Building your API stack",
    "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    "Software Engineering",
    "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    "18 Jan 2027",
    "Lana Steiner",
  ),
  article(
    "article-3.5",
    "Bill Walsh leadership lessons",
    "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    "Product",
    "https://www.untitledui.com/blog/two-people.webp",
    "17 Jan 2027",
    "Alec Whitten",
  ),
  article(
    "article-4",
    "PM mental models",
    "Mental models are simple expressions of complex processes or relationships.",
    "Product",
    "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    "16 Jan 2027",
    "Demi Wilkinson",
  ),
  article(
    "article-5",
    "What is wireframing?",
    "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    "Design",
    "https://www.untitledui.com/marketing/wireframing-layout.webp",
    "15 Jan 2027",
    "Candice Wu",
  ),
  article(
    "article-6",
    "How collaboration makes us better designers",
    "Collaboration can make our teams stronger, and our individual designs better.",
    "Design",
    "https://www.untitledui.com/marketing/two-people.webp",
    "14 Jan 2027",
    "Natali Craig",
  ),
  article(
    "article-7",
    "Our top 10 Javascript frameworks to use",
    "JavaScript frameworks make development easy with extensive features and functionalities.",
    "Product",
    "https://www.untitledui.com/marketing/workspace-5.webp",
    "13 Jan 2027",
    "Drew Cano",
  ),
  article(
    "article-8",
    "Podcast: Creating a better CX Community",
    "Starting a community doesn't need to be complicated, but how do you get started?",
    "Customer Success",
    "https://www.untitledui.com/marketing/sythesize.webp",
    "12 Jan 2027",
    "Orlando Diggs",
  ),
] as const;
const args = {
  articles,
  description: "The latest industry news, interviews, technologies, and resources.",
  eyebrow: "Our blog",
  featuredArticle,
  heading: "Resources and insights",
  pageCount: 10,
  sortLabel: "Sort by",
  sortOptions: [
    { id: "recent", label: "Most recent" },
    { id: "popular", label: "Most popular" },
    { id: "viewed", label: "Most viewed" },
  ],
  tabs: [
    { id: "all", label: "View all" },
    { id: "design", label: "Design" },
    { id: "product", label: "Product" },
    { id: "software-engineering", label: "Software Engineering" },
    { id: "customer-success", label: "Customer Success" },
  ],
} as const;

export default {
  ...componentMeta("blog-header-featured-post-01"),
  title: "Untitled UI/Marketing/Blog/Blog Header Featured Post 01",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof blogHeaderFeaturedPost01<Message>>[1]) =>
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
    const design = canvas.getByRole("button", { name: "Design" });
    await userEvent.click(design);
    await expect(design).toHaveAttribute("aria-pressed", "true");
    const sort = canvas.getByRole("combobox", { name: "Sort by" });
    await userEvent.selectOptions(sort, "popular");
    await expect(sort).toHaveValue("popular");
    const post = canvas.getAllByRole("link", { name: /UX review presentations/u }).at(0);
    if (post === undefined) {
      return;
    }
    await userEvent.click(post);
    await waitFor(() => expect(post).toHaveAttribute("href", "#article-opened"));
  },
};
