/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF and live browser interactions use the browser promise API. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionSplitLayout01 } from "../../../src/marketing/blog-section-split-layout-01.ts";
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
  viewAllLabel: S.String,
});
type Model = typeof Args.Type;
const ArticleOpened = m("BlogSectionSplitLayout01ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogSectionSplitLayout01AuthorOpened", { id: S.String });
const ViewAll = m("BlogSectionSplitLayout01ViewAll");
type Message = typeof ArticleOpened.Type | typeof AuthorOpened.Type | typeof ViewAll.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogSectionSplitLayout01ArticleOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, categoryHref: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSplitLayout01AuthorOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, authorHref: "#author-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSplitLayout01ViewAll" }, () => ({
        ...model,
        viewAllLabel: "All posts opened",
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogSectionSplitLayout01<Message>>[1]) =>
    blogSectionSplitLayout01(
      {
        ...model,
        onArticle: (id) => ArticleOpened({ id }),
        onAuthor: (id) => AuthorOpened({ id }),
        onViewAll: ViewAll(),
      },
      h,
    ),
} as const;

const args = {
  articles: [
    {
      authorAvatarSrc: agentFace("Olivia Rhye"),
      authorHref: "#olivia-rhye",
      authorName: "Olivia Rhye",
      categoryHref: "#design",
      categoryName: "Design",
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
      authorAvatarSrc: agentFace("Phoenix Baker"),
      authorHref: "#phoenix-baker",
      authorName: "Phoenix Baker",
      categoryHref: "#design",
      categoryName: "Design",
      href: "#migrating-to-linear",
      id: "article-2",
      publishedAt: "19 Jan 2027",
      readingTime: "8 min read",
      summary:
        "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
      thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
      title: "Migrating to Linear 101",
    },
  ],
  description: "The latest industry news, interviews, technologies, and resources.",
  eyebrow: "Latest",
  heading: "From the blog",
  viewAllLabel: "View all posts",
} as const;

export default {
  ...componentMeta("blog-section-split-layout-01"),
  title: "Untitled UI/Marketing/Blog/Blog Section Split Layout 01",
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
    const article = canvas.getByText("UX review presentations");
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    const author = canvas.getByText("Olivia Rhye");
    author.focus();
    await expect(author).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(author).toHaveAttribute("href", "#author-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "View all posts" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "All posts opened" })).toBeInTheDocument(),
    );
  },
};
