/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { dropdownMenuWithTwoColsAndLinksAndFooter } from "../../../src/marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({
  columns: S.Array(
    S.Struct({
      id: S.String,
      items: S.Array(
        S.Struct({
          href: S.String,
          iconPath: S.String,
          id: S.String,
          subtitle: S.String,
          title: S.String,
        }),
      ),
      title: S.String,
    }),
  ),
  description: S.String,
  documentationLabel: S.String,
  getStartedItems: S.Array(S.Struct({ href: S.String, id: S.String, title: S.String })),
  getStartedTitle: S.String,
  heading: S.String,
  viewAllLabel: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("DropdownMenuWithTwoColsAndLinksAndFooterAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (
    model: Model,
    h: Parameters<typeof dropdownMenuWithTwoColsAndLinksAndFooter<Message>>[1],
  ) =>
    h.div(
      [h.Class("-m-8")],
      [
        dropdownMenuWithTwoColsAndLinksAndFooter(
          {
            ...model,
            onAction: (id) => Action({ id }),
            onGetStarted: (id) => Action({ id }),
            onItem: (itemId) => Action({ id: itemId }),
            onViewAll: Action({ id: "view-all" }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  columns: [
    {
      id: "design",
      items: [
        {
          href: "#icons",
          iconPath:
            "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.196z",
          id: "icons",
          subtitle: "Access thousands of beautifully crafted SVG icons.",
          title: "Icon library",
        },
        {
          href: "#figma-components",
          iconPath:
            "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zM16 13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z",
          id: "figma-components",
          subtitle: "Copy production-ready components into your Figma files.",
          title: "Figma components",
        },
        {
          href: "#illustrations",
          iconPath:
            "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
          id: "illustrations",
          subtitle: "Bring screens to life with scenes and device frames.",
          title: "Illustrations",
        },
      ],
      title: "Design",
    },
    {
      id: "develop",
      items: [
        {
          href: "#react-library",
          iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
          id: "react-library",
          subtitle: "Compose accessible UIs with production React primitives.",
          title: "React library",
        },
        {
          href: "#starter-kits",
          iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
          id: "starter-kits",
          subtitle: "Launch faster with ready-to-customize app templates.",
          title: "Starter kits",
        },
        {
          href: "#cli-integration",
          iconPath:
            "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
          id: "cli-integration",
          subtitle: "Scaffold features inside your codebase in one command.",
          title: "CLI integration",
        },
      ],
      title: "Develop",
    },
  ],
  description: "Explore the tools that help your team design and ship great products.",
  documentationLabel: "Read documentation",
  getStartedItems: [
    { href: "#documentation", id: "documentation", title: "Documentation" },
    { href: "#api-reference", id: "api-reference", title: "API reference" },
    { href: "#examples", id: "examples", title: "Examples" },
  ],
  getStartedTitle: "Getting started",
  heading: "Products",
  viewAllLabel: "View all products",
} as const;

export default {
  ...componentMeta("dropdown-menu-with-two-cols-and-links-and-footer"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Dropdown Menu With Two Cols And Links And Footer",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (
      model: Model,
      h: Parameters<typeof dropdownMenuWithTwoColsAndLinksAndFooter<Message>>[1],
    ) =>
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
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeVisible());
  },
};
