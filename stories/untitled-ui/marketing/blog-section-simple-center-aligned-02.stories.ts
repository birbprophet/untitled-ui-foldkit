/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as Arr from "effect/Array";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogSectionSimpleCenterAligned02 } from "../../../src/marketing/blog-section-simple-center-aligned-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
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
  heading: S.String,
});
type Model = typeof Args.Type;
const ArticleOpened = m("BlogSectionSimpleCenterAligned02ArticleOpened", { id: S.String });
const AuthorOpened = m("BlogSectionSimpleCenterAligned02AuthorOpened", { id: S.String });
const CategoryOpened = m("BlogSectionSimpleCenterAligned02CategoryOpened", { id: S.String });
type Message = typeof ArticleOpened.Type | typeof AuthorOpened.Type | typeof CategoryOpened.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogSectionSimpleCenterAligned02ArticleOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, href: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSimpleCenterAligned02AuthorOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id
            ? { ...article, author: { ...article.author, href: "#author-opened" } }
            : article,
        ),
      })),
      Match.when({ _tag: "BlogSectionSimpleCenterAligned02CategoryOpened" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id
            ? { ...article, category: { ...article.category, href: "#category-opened" } }
            : article,
        ),
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogSectionSimpleCenterAligned02<Message>>[1]) =>
    blogSectionSimpleCenterAligned02(
      {
        ...model,
        messageForArticle: (id) => ArticleOpened({ id }),
        messageForAuthor: (id) => AuthorOpened({ id }),
        messageForCategory: (id) => CategoryOpened({ id }),
      },
      h,
    ),
} as const;

const articles = [
  {
    author: { avatarUrl: agentFace("Olivia Rhye"), href: "#", name: "Olivia Rhye" },
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
    author: { avatarUrl: agentFace("Phoenix Baker"), href: "#", name: "Phoenix Baker" },
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
    author: { avatarUrl: agentFace("Lana Steiner"), href: "#", name: "Lana Steiner" },
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
    author: { avatarUrl: agentFace("Demi Wilkinson"), href: "#", name: "Demi Wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "PM mental models",
  },
] as const;

const args = {
  articles,
  description: "The latest news, technologies, and resources from our team.",
  heading: "Latest writings",
} as const;

export default {
  ...componentMeta("blog-section-simple-center-aligned-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Section Simple Center Aligned 02",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [
          blogSectionSimpleCenterAligned02(
            {
              ...model,
              messageForArticle: (id) => ArticleOpened({ id }),
              messageForAuthor: (id) => AuthorOpened({ id }),
              messageForCategory: (id) => CategoryOpened({ id }),
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
    const articleLinks = canvas.getAllByRole("link", {
      name: "UX review presentations",
    });
    await expect(articleLinks).toHaveLength(2);
    const article = Option.getOrElse(Arr.get(articleLinks, 0), () =>
      canvas.getByRole("link", { name: "Missing authenticated article image link" }),
    );
    const category = Option.getOrElse(Arr.get(articleLinks, 1), () =>
      canvas.getByRole("link", { name: "Missing authenticated article title link" }),
    );
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(category);
    await waitFor(() => expect(category).toHaveAttribute("href", "#category-opened"));

    const authorLinks = canvas.getAllByRole("link", { name: "Olivia Rhye" });
    const author = Option.getOrElse(Arr.get(authorLinks, authorLinks.length - 1), () =>
      canvas.getByRole("link", { name: "Missing authenticated author link" }),
    );
    await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute("href", "#author-opened"));
  },
};
