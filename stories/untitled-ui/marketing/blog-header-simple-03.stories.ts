/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API. */
import * as S from "effect/Schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  blogHeaderSimple03,
  blogHeaderSimple03Articles,
} from "../../../src/marketing/blog-header-simple-03.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const BadgeColor = S.Union([
  S.Literal("brand"),
  S.Literal("indigo"),
  S.Literal("pink"),
  S.Literal("sky"),
  S.Literal("success"),
  S.Literal("slate"),
  S.Literal("orange"),
]);
const Tag = S.Struct({ color: BadgeColor, href: S.String, name: S.String });
const Article = S.Struct({
  authorName: S.String,
  categoryHref: S.String,
  href: S.String,
  id: S.String,
  publishedAt: S.String,
  summary: S.String,
  tags: S.Array(Tag),
  thumbnailUrl: S.String,
  title: S.String,
});
const Args = S.Struct({
  articles: S.Array(Article),
  description: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  page: S.Number,
  privacyHref: S.String,
  subscribeLabel: S.String,
  totalPages: S.Number,
});
const Model = S.Struct({ ...Args.fields, email: S.String, isSubmitted: S.Boolean });
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Article"; id: string }>
  | Readonly<{ _tag: "Email"; email: string }>
  | Readonly<{ _tag: "Page"; page: number }>
  | Readonly<{ _tag: "Subscribe" }>;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, email: "", isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Email") {
      return { ...model, email: message.email };
    }
    if (message._tag === "Page") {
      return { ...model, page: message.page };
    }
    if (message._tag === "Subscribe") {
      return { ...model, isSubmitted: true };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id ? { ...article, categoryHref: "#article-opened" } : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderSimple03<Message>>[1]) =>
    blogHeaderSimple03(
      {
        ...model,
        onArticle: (id): Message => ({ _tag: "Article", id }),
        onEmailInput: (email): Message => ({ _tag: "Email", email }),
        onPage: (page): Message => ({ _tag: "Page", page }),
        onSubscribe: { _tag: "Subscribe" },
        subscribeLabel: model.isSubmitted ? "Subscribed" : model.subscribeLabel,
      },
      h,
    ),
} as const;

const args = {
  articles: blogHeaderSimple03Articles,
  description:
    "The blog is the best source of information for interviews, tips, guides, industry best practices, and news. Subscribe for updates in your inbox every week.",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Our blog",
  heading: "Stories and interviews",
  page: 1,
  privacyHref: "#",
  subscribeLabel: "Get started",
  totalPages: 10,
} as const;

export default {
  ...componentMeta("blog-header-simple-03"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 03",
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
    const email = await canvas.findByRole("textbox", { name: "Email" });
    await userEvent.type(email, "olivia@example.com");
    await expect(email).toHaveValue("olivia@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await expect(await canvas.findByRole("button", { name: "Subscribed" })).toBeInTheDocument();
    const articleLinks = await canvas.findAllByRole("link", { name: /UX review presentations/u });
    await expect(articleLinks).toHaveLength(2);
    const articleLink = articleLinks.at(1) ?? canvasElement.ownerDocument.createElement("a");
    await userEvent.click(articleLink);
    await waitFor(() => expect(articleLink).toHaveAttribute("href", "#article-opened"));
    await userEvent.click(canvas.getByRole("button", { name: "Go to next page" }));
    await expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
