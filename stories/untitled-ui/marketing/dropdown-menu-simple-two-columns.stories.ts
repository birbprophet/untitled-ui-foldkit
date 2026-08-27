/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { dropdownMenuSimpleTwoColumns } from "../../../src/marketing/dropdown-menu-simple-two-columns.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  items: S.Array(
    S.Struct({
      href: S.String,
      iconPath: S.String,
      id: S.String,
      subtitle: S.String,
      title: S.String,
    }),
  ),
});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("DropdownMenuSimpleTwoColumnsAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof dropdownMenuSimpleTwoColumns<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        dropdownMenuSimpleTwoColumns(
          {
            ...model,
            onItem: (itemId) => Action({ id: itemId }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  items: [
    {
      href: "#blog",
      iconPath:
        "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
      id: "blog",
      subtitle: "The latest industry news, updates, and info.",
      title: "Blog",
    },
    {
      href: "#changelog",
      iconPath:
        "M11.48 3.5a.56.56 0 0 0-1.12 0l-.19 1.12a7.01 7.01 0 0 1-5.65 5.65l-1.12.19a.56.56 0 0 0 0 1.12l1.12.19a7.01 7.01 0 0 1 5.65 5.65l.19 1.12a.56.56 0 0 0 1.12 0l.19-1.12a7.01 7.01 0 0 1 5.65-5.65l1.12-.19a.56.56 0 0 0 0-1.12l-1.12-.19a7.01 7.01 0 0 1-5.65-5.65l-.19-1.12Z",
      id: "changelog",
      subtitle: "New updates and improvements to Siglata.",
      title: "Changelog",
    },
    {
      href: "#customers",
      iconPath:
        "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
      id: "customers",
      subtitle: "Learn how teams use Siglata to ship great products faster.",
      title: "Customers",
    },
    {
      href: "#help-center",
      iconPath:
        "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
      id: "help-center",
      subtitle: "Get answers to common questions about Siglata.",
      title: "Help center",
    },
    {
      href: "#integrations",
      iconPath:
        "M11 4a2 2 0 1 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a2 2 0 1 0 0 4h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1a2 2 0 1 0-4 0v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H4a2 2 0 1 1 0-4h1a1 1 0 0 0 1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1V4z",
      id: "integrations",
      subtitle: "Connect Siglata to the tools you already use.",
      title: "Integrations",
    },
    {
      href: "#api-reference",
      iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      id: "api-reference",
      subtitle: "Build custom workflows with our developer API.",
      title: "API reference",
    },
  ],
} as const;

export default {
  ...componentMeta("dropdown-menu-simple-two-columns"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Dropdown Menu Simple Two Columns",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof dropdownMenuSimpleTwoColumns<Message>>[1]) =>
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
