/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook's browser interaction API is promise based. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderSimple06,
  blogHeaderSimple06Articles,
  blogHeaderSimple06Categories,
} from "../../../../../packages/ui/src/marketing/blog-header-simple-06.ts";
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
  desktopDescription: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  mobileDescription: S.String,
  privacyCopy: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  submitLabel: S.String,
  totalPages: S.Finite,
});
type Args = typeof Args.Type;
const Model = S.Struct({
  ...Args.fields,
  currentPage: S.Finite,
  email: S.String,
  focusedCategoryId: S.String,
  selectedCategoryId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "ArticleSelected"; id: string }>
  | Readonly<{ _tag: "ArticleCategorySelected"; id: string }>
  | Readonly<{ _tag: "AuthorSelected"; id: string }>
  | Readonly<{ _tag: "CategoryFocused"; id: string }>
  | Readonly<{ _tag: "CategorySelected"; id: string }>
  | Readonly<{ _tag: "EmailChanged"; email: string }>
  | Readonly<{ _tag: "PageSelected"; page: number }>
  | Readonly<{ _tag: "PrivacySelected" }>
  | Readonly<{ _tag: "Subscribe" }>;

const definition = {
  Args,
  Model,
  init: (args: Args): Model => ({
    ...args,
    currentPage: 1,
    email: "",
    focusedCategoryId: "all",
    selectedCategoryId: "all",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "EmailChanged") {
      return { ...model, email: message.email };
    }
    if (message._tag === "CategoryFocused") {
      return { ...model, focusedCategoryId: message.id };
    }
    if (message._tag === "CategorySelected") {
      return { ...model, focusedCategoryId: message.id, selectedCategoryId: message.id };
    }
    if (message._tag === "PageSelected") {
      return { ...model, currentPage: message.page };
    }
    if (message._tag === "Subscribe") {
      return { ...model, submitLabel: "Subscribed" };
    }
    if (message._tag === "PrivacySelected") {
      return { ...model, privacyHref: "#privacy-opened" };
    }
    if (message._tag === "ArticleSelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id ? { ...article, href: "#article-opened" } : article,
        ),
      };
    }
    if (message._tag === "ArticleCategorySelected") {
      return {
        ...model,
        articles: model.articles.map((article) =>
          article.id === message.id
            ? { ...article, category: { ...article.category, href: "#category-opened" } }
            : article,
        ),
      };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof blogHeaderSimple06<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        blogHeaderSimple06(
          {
            ...model,
            onArticle: (id): Message => ({ _tag: "ArticleSelected", id }),
            onAuthor: (id): Message => ({ _tag: "AuthorSelected", id }),
            onCategory: (id): Message => ({ _tag: "ArticleCategorySelected", id }),
            onCategoryFocus: (id): Message => ({ _tag: "CategoryFocused", id }),
            onCategorySelect: (id): Message => ({ _tag: "CategorySelected", id }),
            onEmail: (email): Message => ({ _tag: "EmailChanged", email }),
            onPage: (page): Message => ({ _tag: "PageSelected", page }),
            onPrivacy: { _tag: "PrivacySelected" },
            onSubscribe: { _tag: "Subscribe" },
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  articles: [...blogHeaderSimple06Articles],
  categories: [...blogHeaderSimple06Categories],
  desktopDescription:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  emailPlaceholder: "Enter your email",
  eyebrow: "Our blog",
  heading: "Stories and interviews",
  mobileDescription:
    "The blog is the best source of information for interviews, tips, guides, industry best practices, and news. Subscribe for updates in your inbox every week. No spam.",
  privacyCopy: "We care about your data in our",
  privacyHref: "#",
  privacyLabel: "privacy policy",
  submitLabel: "Get started",
  totalPages: 10,
} satisfies Args;

export default {
  ...componentMeta("blog-header-simple-06"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 06",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs): Model => ({
      ...definition.init(storyArgs),
      email: "operator@example.com",
      focusedCategoryId: "design",
      selectedCategoryId: "design",
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
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
    const email = await canvas.findByRole("textbox", { name: "Enter your email" });
    await userEvent.type(email, "operator@example.com");
    await waitFor(() => expect(email).toHaveValue("operator@example.com"));

    const submit = await canvas.findByRole("button", { name: "Get started" });
    await userEvent.click(submit);
    await canvas.findByRole("button", { name: "Subscribed" });

    const design = await canvas.findByRole("tab", { name: "Design" });
    await userEvent.click(design);
    await waitFor(() => expect(design).toHaveAttribute("aria-selected", "true"));

    const next = await canvas.findByRole("button", { name: "Next" });
    await userEvent.click(next);
    const pageTwo = await canvas.findByLabelText("Page 2");
    await waitFor(() => expect(pageTwo).toHaveAttribute("aria-current", "page"));
  },
};
