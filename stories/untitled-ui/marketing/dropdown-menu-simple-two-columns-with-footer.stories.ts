/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { dropdownMenuSimpleTwoColumnsWithFooter } from "../../../src/marketing/dropdown-menu-simple-two-columns-with-footer.ts";
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
  footerActions: S.Array(
    S.Struct({
      href: S.String,
      iconPath: S.optional(S.String),
      id: S.String,
      label: S.String,
    }),
  ),
});
const Model = Args;
type Model = typeof Model.Type;

const Action = m("DropdownMenuSimpleTwoColumnsWithFooterAction", { id: S.String });
type Message = typeof Action.Type;

const definition = {
  Args,
  Model,
  init: (args: Model): Model => args,
  update: (model: Model, _message: Message): Model => model,
  view: (model: Model, h: Parameters<typeof dropdownMenuSimpleTwoColumnsWithFooter<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        dropdownMenuSimpleTwoColumnsWithFooter(
          {
            ...model,
            onAction: (actionId) => Action({ id: actionId }),
            onItem: (itemId) => Action({ id: itemId }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  columns: [
    {
      id: "product",
      items: [
        {
          href: "#reports",
          iconPath:
            "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z",
          id: "reports",
          subtitle: "Dive into product usage metrics in real time.",
          title: "Interactive reports",
        },
        {
          href: "#cohorts",
          iconPath:
            "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
          id: "cohorts",
          subtitle: "See how groups of users retain over time.",
          title: "Cohorts",
        },
        {
          href: "#funnels",
          iconPath:
            "M3 4a1 1 0 0 0-1 1v2.586a1 1 0 0 0 .293.707l6.414 6.414a1 1 0 0 1 .293.707V17l-4 4v1h12v-1l-4-4v-1.586a1 1 0 0 1 .293-.707l6.414-6.414a1 1 0 0 0 .293-.707V5a1 1 0 0 0-1-1H3z",
          id: "funnels",
          subtitle: "Spot where users drop off before converting.",
          title: "Funnels",
        },
      ],
      title: "Product",
    },
    {
      id: "insights",
      items: [
        {
          href: "#experiments",
          iconPath:
            "M19.428 15.428a2 2 0 0 0-1.022-.547l-2.387-.477a6 6 0 0 0-3.86.517l-.318.158a6 6 0 0 1-3.86.517L6.05 15.21a2 2 0 0 0-1.806.547M8 4h8l-1 1v5.172a2 2 0 0 0 .586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 0 0 9 10.172V5L8 4z",
          id: "experiments",
          subtitle: "Run A/B tests with built-in statistical rigor.",
          title: "Experiments",
        },
        {
          href: "#alerts",
          iconPath:
            "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1h6z",
          id: "alerts",
          subtitle: "Get notified when key metrics move unexpectedly.",
          title: "Alerts",
        },
        {
          href: "#goals",
          iconPath:
            "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
          id: "goals",
          subtitle: "Set targets and monitor progress automatically.",
          title: "Goals",
        },
      ],
      title: "Insights",
    },
  ],
  footerActions: [
    {
      href: "#signup",
      id: "signup",
      label: "Sign up for our newsletter",
    },
    {
      href: "#demo",
      iconPath:
        "M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664z M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
      id: "demo",
      label: "Watch demo",
    },
    {
      href: "#sales",
      iconPath:
        "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      id: "sales",
      label: "Chat to sales",
    },
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
    view: (
      model: Model,
      h: Parameters<typeof dropdownMenuSimpleTwoColumnsWithFooter<Message>>[1],
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
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link");
    await userEvent.click(link);
    await waitFor(() => expect(link).toBeVisible());
  },
};
