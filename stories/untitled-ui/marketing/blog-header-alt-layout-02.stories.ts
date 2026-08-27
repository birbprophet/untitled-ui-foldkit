/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import * as Match from "effect/Match";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderAltLayout02 } from "../../../../../packages/ui/src/marketing/blog-header-alt-layout-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Tag = S.Struct({
  color: S.Union([
    S.Literal("brand"),
    S.Literal("indigo"),
    S.Literal("pink"),
    S.Literal("sky"),
    S.Literal("success"),
    S.Literal("slate"),
    S.Literal("orange"),
  ]),
  href: S.String,
  name: S.String,
});
const Article = S.Struct({
  authorHref: S.String,
  authorName: S.String,
  categoryHref: S.String,
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  summary: S.String,
  tags: S.Array(Tag),
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  email: S.String,
  eyebrow: S.String,
  heading: S.String,
  page: S.Number,
  pageCount: S.Number,
  privacyHref: S.String,
});
type Model = typeof Args.Type;
const ArticleSelected = m("BlogHeaderAltLayout02ArticleSelected", { id: S.String });
const AuthorSelected = m("BlogHeaderAltLayout02AuthorSelected", { id: S.String });
const EmailChanged = m("BlogHeaderAltLayout02EmailChanged", { email: S.String });
const PageSelected = m("BlogHeaderAltLayout02PageSelected", { page: S.Number });
const Subscribed = m("BlogHeaderAltLayout02Subscribed");
const TagSelected = m("BlogHeaderAltLayout02TagSelected", { id: S.String, tag: S.String });
type Message =
  | typeof ArticleSelected.Type
  | typeof AuthorSelected.Type
  | typeof EmailChanged.Type
  | typeof PageSelected.Type
  | typeof Subscribed.Type
  | typeof TagSelected.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "BlogHeaderAltLayout02ArticleSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, href: "#article-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderAltLayout02AuthorSelected" }, ({ id }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id ? { ...article, authorHref: "#author-opened" } : article,
        ),
      })),
      Match.when({ _tag: "BlogHeaderAltLayout02EmailChanged" }, ({ email }) => ({
        ...model,
        email,
      })),
      Match.when({ _tag: "BlogHeaderAltLayout02PageSelected" }, ({ page }) => ({ ...model, page })),
      Match.when({ _tag: "BlogHeaderAltLayout02Subscribed" }, () => ({
        ...model,
        email: "subscribed@example.com",
      })),
      Match.when({ _tag: "BlogHeaderAltLayout02TagSelected" }, ({ id, tag: selectedTag }) => ({
        ...model,
        articles: model.articles.map((article) =>
          article.id === id
            ? {
                ...article,
                tags: article.tags.map((tag) =>
                  tag.name === selectedTag ? { ...tag, href: "#tag-opened" } : tag,
                ),
              }
            : article,
        ),
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof blogHeaderAltLayout02<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderAltLayout02(
          {
            ...model,
            onArticle: (id) => ArticleSelected({ id }),
            onAuthor: (id) => AuthorSelected({ id }),
            onEmail: (email) => EmailChanged({ email }),
            onPage: (page) => PageSelected({ page }),
            onSubscribe: Subscribed(),
            onTag: (id, tag) => TagSelected({ id, tag }),
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
    categoryHref: "#",
    href: "#",
    id: "article-1",
    isFeatured: true,
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
    authorHref: "#",
    authorName: "Phoenix Baker",
    categoryHref: "#",
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "pink", href: "#", name: "Tools" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    authorHref: "#",
    authorName: "Lana Steiner",
    categoryHref: "#",
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
    authorHref: "#",
    authorName: "Alec Whitten",
    categoryHref: "#",
    href: "#",
    id: "article-4",
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
    authorHref: "#",
    authorName: "Demi Wilkinson",
    categoryHref: "#",
    href: "#",
    id: "article-5",
    publishedAt: "16 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "orange", href: "#", name: "Frameworks" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    authorHref: "#",
    authorName: "Candice Wu",
    categoryHref: "#",
    href: "#",
    id: "article-6",
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
    authorHref: "#",
    authorName: "Natali Craig",
    categoryHref: "#",
    href: "#",
    id: "article-7",
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
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  email: "",
  eyebrow: "Our blog",
  heading: "Stories and interviews",
  page: 1,
  pageCount: 10,
  privacyHref: "#",
} as const;

export default {
  ...componentMeta("blog-header-alt-layout-02"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Alt Layout 02",
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
    const email = canvas.getByRole("textbox", { name: "Email address" });
    await userEvent.type(email, "reader@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await waitFor(() => expect(email).toHaveValue("subscribed@example.com"));
    const [article] = canvas.getAllByRole("link", { name: /UX review presentations/u });
    if (article === undefined) {
      return;
    }
    await userEvent.click(article);
    await waitFor(() => expect(article).toHaveAttribute("href", "#article-opened"));
    const next = canvas.getByRole("button", { name: "Next" });
    await userEvent.click(next);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute(
        "aria-current",
        "page",
      ),
    );
  },
};
