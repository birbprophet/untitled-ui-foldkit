/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { dropdownMenuSimpleTwoColumnsWithFooter } from "../../../../../packages/ui/src/marketing/dropdown-menu-simple-two-columns-with-footer.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Args = S.Struct({});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("DropdownMenuSimpleTwoColumnsWithFooterAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof dropdownMenuSimpleTwoColumnsWithFooter<Message>>[1]) =>
    h.div([h.Class("-m-8")], [dropdownMenuSimpleTwoColumnsWithFooter({ ...model, onAction: (actionId) => Action({ id: actionId }), onItem: (itemId) => Action({ id: itemId }) }, h)]),
} as const;

const args = {
  columns: [
    {
      id: "products",
      title: "Products",
      items: [{ href: "#reports", iconPath: "M3 3v18h18", id: "reports", subtitle: "Learn about your users.", title: "Interactive reports" }],
    },
    {
      id: "use-cases",
      title: "Use cases",
      items: [{ href: "#convert", iconPath: "M9 12l2 2 4-4", id: "convert", subtitle: "Analyze conversion rates.", title: "Convert" }],
    },
  ],
  footerActions: [
    { href: "#signup", id: "signup", label: "Sign up for free" },
    { href: "#demo", iconPath: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-13.5v7l5.25 3.15-.75-6.45L17.25 9 12 8.5Z", id: "demo", label: "Watch demo" },
    { href: "#sales", iconPath: "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835", id: "sales", label: "Chat to sales" },
  ],
} as const;

export default {
  ...componentMeta("dropdown-menu-simple-two-columns-with-footer"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Dropdown Menu Simple Two Columns With Footer",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof dropdownMenuSimpleTwoColumnsWithFooter<Message>>[1]) =>
      h.div([h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    const link = canvas.queryByRole("link");
    if (link !== null) {
      await userEvent.click(link);
      await waitFor(() => expect(link).toBeVisible());
    }
  },
};
