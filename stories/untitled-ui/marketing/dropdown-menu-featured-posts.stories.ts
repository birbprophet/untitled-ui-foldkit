/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { dropdownMenuFeaturedPosts } from "../../../src/marketing/dropdown-menu-featured-posts.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  allPostsLabel: S.String,
  columnTitle: S.String,
  items: S.Array(
    S.Struct({
      href: S.String,
      iconPath: S.String,
      id: S.String,
      subtitle: S.String,
      title: S.String,
    }),
  ),
  posts: S.Array(
    S.Struct({
      id: S.String,
      imageAlt: S.String,
      imageSrc: S.String,
      subtitle: S.String,
      title: S.String,
    }),
  ),
  postsTitle: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("DropdownMenuFeaturedPostsAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof dropdownMenuFeaturedPosts<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        dropdownMenuFeaturedPosts(
          {
            ...model,
            onAllPosts: Action({ id: "all-posts" }),
            onItem: (itemId) => Action({ id: itemId }),
            onPost: (postId) => Action({ id: postId }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  allPostsLabel: "All blog posts",
  columnTitle: "Company",
  items: [
    {
      href: "#blog",
      iconPath:
        "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      id: "blog",
      subtitle: "The latest industry news and guides curated by our expert team.",
      title: "Blog",
    },
    {
      href: "#stories",
      iconPath:
        "M11.48 3.5a.56.56 0 0 0-1.12 0l-.19 1.12a7.01 7.01 0 0 1-5.65 5.65l-1.12.19a.56.56 0 0 0 0 1.12l1.12.19a7.01 7.01 0 0 1 5.65 5.65l.19 1.12a.56.56 0 0 0 1.12 0l.19-1.12a7.01 7.01 0 0 1 5.65-5.65l1.12-.19a.56.56 0 0 0 0-1.12l-1.12-.19a7.01 7.01 0 0 1-5.65-5.65l-.19-1.12Z",
      id: "stories",
      subtitle: "Learn how our customers are using Siglata to 10x their growth.",
      title: "Customer stories",
    },
  ],
  posts: [
    {
      id: "auto-layout",
      imageAlt: "Auto Layout explained",
      imageSrc: "https://www.untitledui.com/marketing/auto-layout.webp",
      subtitle: "Jump right in—get an overview of the basics.",
      title: "Auto Layout explained",
    },
  ],
  postsTitle: "Latest blog posts",
} as const;

export default {
  ...componentMeta("dropdown-menu-featured-posts"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Dropdown Menu Featured Posts",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof dropdownMenuFeaturedPosts<Message>>[1]) =>
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
    const link = canvas.getByRole("link");
    await userEvent.click(link);
    await waitFor(() => expect(link).toBeVisible());
  },
};
