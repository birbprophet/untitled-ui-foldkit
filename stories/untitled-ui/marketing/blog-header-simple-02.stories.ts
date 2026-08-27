/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in Chromium. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { blogHeaderSimple02 } from "../../../../../packages/ui/src/marketing/blog-header-simple-02.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const LinkLabel = S.Struct({ href: S.String, name: S.String });
const Article = S.Struct({
  author: S.Struct({ avatarSeed: S.String, href: S.String, name: S.String }),
  category: LinkLabel,
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
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  heading: S.String,
  id: S.String,
  pageCount: S.Number,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  subscribeLabel: S.String,
});
const Model = S.Struct({ ...Args.fields, email: S.String, page: S.Number, submitted: S.Boolean });
type Model = typeof Model.Type;
const ArticleOpened = m("BlogHeaderSimple02ArticleOpened", { id: S.String });
const EmailInput = m("BlogHeaderSimple02EmailInput", { email: S.String });
const PageSelected = m("BlogHeaderSimple02PageSelected", { page: S.Number });
const Submitted = m("BlogHeaderSimple02Submitted");
type Message =
  | typeof ArticleOpened.Type
  | typeof EmailInput.Type
  | typeof PageSelected.Type
  | typeof Submitted.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, email: "", page: 1, submitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "BlogHeaderSimple02EmailInput") {
      return { ...model, email: message.email };
    }
    if (message._tag === "BlogHeaderSimple02PageSelected") {
      return { ...model, page: message.page };
    }
    if (message._tag === "BlogHeaderSimple02Submitted") {
      return { ...model, submitted: true };
    }
    return {
      ...model,
      articles: model.articles.map((article) =>
        article.id === message.id ? { ...article, href: "#article-opened" } : article,
      ),
    };
  },
  view: (model: Model, h: Parameters<typeof blogHeaderSimple02<Message>>[1]) =>
    blogHeaderSimple02(
      {
        ...model,
        onArticle: (id) => ArticleOpened({ id }),
        onEmailInput: (email) => EmailInput({ email }),
        onPage: (page) => PageSelected({ page }),
        onSubmit: Submitted(),
      },
      h,
    ),
} as const;

const article = (
  id: string,
  title: string,
  summary: string,
  category: string,
  image: string,
  date: string,
  author: string,
) => ({
  author: { avatarSeed: author.toLowerCase().replaceAll(" ", "-"), href: "#author", name: author },
  category: { href: "#category", name: category },
  href: "#",
  id,
  publishedAt: date,
  readingTime: "8 min read",
  summary,
  thumbnailUrl: image,
  title,
});
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
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  eyebrow: "Blog",
  heading: "Resource library",
  id: "blog-header-simple-02",
  pageCount: 10,
  privacyHref: "#privacy",
  privacyLabel: "privacy policy",
  privacyPrefix: "We care about your data in our",
  subscribeLabel: "Subscribe",
} as const;

export default {
  ...componentMeta("blog-header-simple-02"),
  title: "Untitled UI/Marketing/Blog/Blog Header Simple 02",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof blogHeaderSimple02<Message>>[1]) =>
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
    const email = canvas.getByRole("textbox", { name: "Email" });
    await expect(email).toBeRequired();
    await userEvent.type(email, "operator@siglata.com");
    await expect(email).toHaveValue("operator@siglata.com");
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));
    const post = canvas.getAllByRole("link", { name: /UX review presentations/u }).at(0);
    if (post === undefined) {
      return;
    }
    await userEvent.click(post);
    await waitFor(() => expect(post).toHaveAttribute("href", "#article-opened"));
  },
};
