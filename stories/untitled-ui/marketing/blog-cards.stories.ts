/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogCards } from "../../../src/marketing/blog-cards.ts";
import type { BlogCardsVariant } from "../../../src/marketing/blog-cards.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const BadgeColor = S.Union([
  S.Literal("gray"),
  S.Literal("brand"),
  S.Literal("error"),
  S.Literal("warning"),
  S.Literal("success"),
  S.Literal("slate"),
  S.Literal("sky"),
  S.Literal("blue"),
  S.Literal("indigo"),
  S.Literal("purple"),
  S.Literal("pink"),
  S.Literal("orange"),
]);
const variants = [
  "simple-01-vertical",
  "simple-02-vertical",
  "simple-03-vertical",
  "simple-04-vertical",
  "simple-01-horizontal",
  "simple-02-horizontal",
  "simple-03-horizontal",
  "simple-04-horizontal",
  "card-full-width-image-01-vertical",
  "card-full-width-image-02-vertical",
  "card-full-width-image-03-vertical",
  "card-full-width-image-04-vertical",
  "card-full-width-image-01-horizontal",
  "card-full-width-image-02-horizontal",
  "card-full-width-image-03-horizontal",
  "card-full-width-image-04-horizontal",
] as const satisfies readonly BlogCardsVariant[];
const Variant = S.Union(variants.map((variant) => S.Literal(variant)));
const Tag = S.Struct({ color: BadgeColor, href: S.String, name: S.String });
const Article = S.Struct({
  author: S.Struct({ avatarUrl: S.String, href: S.String, name: S.String }),
  category: S.Struct({ href: S.String, name: S.String }),
  href: S.String,
  id: S.String,
  isFeatured: S.optional(S.Boolean),
  publishedAt: S.String,
  readingTime: S.String,
  summary: S.String,
  tags: S.Array(Tag),
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  article: Article,
  badgeTheme: S.Union([S.Literal("light"), S.Literal("modern")]),
  readPostLabel: S.String,
  variant: Variant,
});
const Model = Args;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Article" }>
  | Readonly<{ _tag: "Author" }>
  | Readonly<{ _tag: "Category" }>
  | Readonly<{ _tag: "Tag"; name: string }>;

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Article") {
    return { ...model, article: { ...model.article, href: "#article-opened" } };
  }
  if (message._tag === "Author") {
    return {
      ...model,
      article: {
        ...model.article,
        author: { ...model.article.author, href: "#author-opened" },
      },
    };
  }
  if (message._tag === "Category") {
    return {
      ...model,
      article: {
        ...model.article,
        category: { ...model.article.category, href: "#category-opened" },
      },
    };
  }
  return {
    ...model,
    article: {
      ...model.article,
      tags: model.article.tags.map((tag) =>
        tag.name === message.name ? { ...tag, href: "#tag-opened" } : tag,
      ),
    },
  };
};

const renderCard = (
  model: Model,
  variant: BlogCardsVariant,
  h: Parameters<typeof blogCards<Message>>[1],
) =>
  blogCards(
    {
      ...model,
      onArticle: { _tag: "Article" },
      onAuthor: { _tag: "Author" },
      onCategory: { _tag: "Category" },
      onTag: (tag): Message => ({ _tag: "Tag", name: tag.name }),
      variant,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update,
  view: (model: Model, h: Parameters<typeof blogCards<Message>>[1]) =>
    h.div(
      [h.Class("mx-auto max-w-3xl bg-bg-primary p-6"), h.Dir("ltr")],
      [renderCard(model, model.variant, h)],
    ),
} as const;

const article = {
  author: { avatarUrl: agentFace("Olivia Rhye"), href: "#author", name: "Olivia Rhye" },
  category: { href: "#design", name: "Design" },
  href: "#article",
  id: "article-1",
  isFeatured: true,
  publishedAt: "20 Jan 2027",
  readingTime: "8 min read",
  summary:
    "How do you create compelling presentations that wow your colleagues and impress your managers?",
  tags: [
    { color: "brand", href: "#design-tag", name: "Design" },
    { color: "indigo", href: "#research", name: "Research" },
    { color: "pink", href: "#presentation", name: "Presentation" },
  ],
  thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
  title: "UX review presentations",
} as const;
const args = {
  article,
  badgeTheme: "light",
  readPostLabel: "Read post",
  variant: "simple-01-vertical",
} as const;

export default {
  ...componentMeta("blog-cards"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Cards",
};
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof blogCards<Message>>[1]) =>
      h.div(
        [h.Class("grid gap-12 bg-bg-primary p-6 md:grid-cols-2"), h.Dir("ltr")],
        variants.map((variant) =>
          h.div(
            [h.Class(variant.endsWith("horizontal") ? "md:col-span-2" : "")],
            [renderCard(model, variant, h)],
          ),
        ),
      ),
  }),
  args,
};
export const States = {
  ...liveStory(definition),
  args: { ...args, badgeTheme: "modern", variant: "simple-02-vertical" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof blogCards<Message>>[1]) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: { ...args, variant: "card-full-width-image-04-vertical" },
};
export const Responsive = {
  ...liveStory(definition),
  args: { ...args, variant: "card-full-width-image-04-horizontal" },
};
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const title = await canvas.findByText(article.title);
    const articleLink = title.closest("a") ?? title;
    await expect(articleLink).toHaveAttribute("href", "#article");
    await userEvent.click(articleLink);
    await waitFor(() => expect(articleLink).toHaveAttribute("href", "#article-opened"));
    const author = canvas.getByRole("link", { name: article.author.name });
    await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute("href", "#author-opened"));
  },
};
