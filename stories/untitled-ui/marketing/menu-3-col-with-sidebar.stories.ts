/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menu3ColWithSidebar } from "../../../src/marketing/menu-3-col-with-sidebar.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuColumns, marketingMenuIconPaths } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({
  cardDescription: S.String,
  cardDismissLabel: S.String,
  cardHref: S.String,
  cardImageAlt: S.String,
  cardImageSrc: S.String,
  cardTitle: S.String,
});
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("Menu3ColWithSidebarAction", { id: S.String });
type Message = typeof Actioned.Type;

const companyColumn = [
  {
    id: "company",
    items: [
      {
        href: "#",
        iconPath: marketingMenuIconPaths.stars,
        id: "customer-stories",
        subtitle: "Learn how customers use Siglata to run the same report every time.",
        title: "Customer stories",
      },
      {
        href: "#",
        iconPath: marketingMenuIconPaths.lifeBuoy,
        id: "support",
        subtitle: "Get all of your questions answered in our help center.",
        title: "Help center",
      },
    ],
    title: "Company",
  },
] as const;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menu3ColWithSidebar<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menu3ColWithSidebar(
          {
            cardDescription: model.cardDescription,
            cardDismissLabel: model.cardDismissLabel,
            cardHref: model.cardHref,
            cardImageAlt: model.cardImageAlt,
            cardImageSrc: model.cardImageSrc,
            cardTitle: model.cardTitle,
            columns: [...marketingMenuColumns, ...companyColumn],
            onChangelog: Actioned({ id: "changelog" }),
            onDismiss: Actioned({ id: "dismiss" }),
            onItem: (id) => Actioned({ id }),
          },
          h,
        ),
      ],
    ),
} as const;

const args = {
  cardDescription: "The latest releases, improvements, and fixes.",
  cardDismissLabel: "Dismiss",
  cardHref: "#",
  cardImageAlt: "Siglata product release preview",
  cardImageSrc: "https://www.untitledui.com/marketing/conversation.webp",
  cardTitle: "See what's new in Siglata",
} as const;

export default {
  ...componentMeta("menu-3-col-with-sidebar"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu 3 Col With Sidebar",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menu3ColWithSidebar<Message>>[1]) =>
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
