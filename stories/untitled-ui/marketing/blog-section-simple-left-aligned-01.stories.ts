/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionSimpleLeftAligned01 } from "../../../src/marketing/blog-section-simple-left-aligned-01.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

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
  description: S.String,
  eyebrow: S.String,
  heading: S.String,
  viewAllLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, viewAllOpened: S.Boolean });
type Model = typeof Model.Type;
const ArticleSelected = m("BlogSectionSimpleLeftAligned01ArticleSelected", { id: S.String });
const AuthorSelected = m("BlogSectionSimpleLeftAligned01AuthorSelected", { id: S.String });
const ViewAllSelected = m("BlogSectionSimpleLeftAligned01ViewAllSelected");
type Message =
  | typeof ArticleSelected.Type
  | typeof AuthorSelected.Type
  | typeof ViewAllSelected.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, viewAllOpened: false }),
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogSectionSimpleLeftAligned01ArticleSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, href: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSimpleLeftAligned01AuthorSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, authorHref: "#author-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSimpleLeftAligned01ViewAllSelected" }, () => ({
        ...model,
        viewAllLabel: "All posts opened",
        viewAllOpened: true,
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogSectionSimpleLeftAligned01<Message>>[1]) =>
    h.div(
      [h.Class("-m-8"), h.DataAttribute("view-all-opened", String(model.viewAllOpened))],
      [
        blogSectionSimpleLeftAligned01(
          {
            ...model,
            onArticle: (id) => ArticleSelected({ id }),
            onAuthor: (id) => AuthorSelected({ id }),
            onViewAll: ViewAllSelected(),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [
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
  ],
  description: "Tool and strategies modern teams need to help their companies grow.",
  eyebrow: "Our blog",
  heading: "Latest blog posts",
  viewAllLabel: "View all posts",
} as const;

export default {
  ...componentMeta("blog-section-simple-left-aligned-01"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Simple Left Aligned 01",
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
    const [article] = canvas.getAllByRole("link", { name: /UX review presentations/u });
    if (article === undefined) {
      return;
    }
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    const author = canvas.getByRole("link", { name: "Olivia Rhye" });
    await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute("href", "#author-opened"));
    const [viewAll] = canvas.getAllByRole("button", { name: "View all posts" });
    if (viewAll === undefined) {
      return;
    }
    await userEvent.click(viewAll);
    await waitFor(() =>
      expect(canvas.getAllByRole("button", { name: "All posts opened" })).toHaveLength(2),
    );
  },
};
