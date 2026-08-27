/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menu4ColWithFooter } from "../../../src/marketing/menu-4-col-with-footer.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import {
  marketingMenuColumns,
  marketingMenuFooterActions,
  marketingMenuIconPaths,
} from "./marketing-menu-fixtures.ts";

const Args = S.Struct({ ctaLabel: S.String, prompt: S.String });
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("Menu4ColWithFooterAction", { id: S.String });
type Message = typeof Actioned.Type;

const extraColumns = [
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
  {
    id: "get-started",
    items: [
      {
        href: "#",
        iconPath: marketingMenuIconPaths.code,
        id: "docs",
        subtitle: "Guides and API reference for the Siglata platform.",
        title: "Documentation",
      },
      {
        href: "#",
        iconPath: marketingMenuIconPaths.book,
        id: "changelog",
        subtitle: "The latest releases, improvements, and fixes.",
        title: "Changelog",
      },
    ],
    title: "Get started",
  },
] as const;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menu4ColWithFooter<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menu4ColWithFooter(
          {
            actions: marketingMenuFooterActions,
            columns: [...marketingMenuColumns, ...extraColumns],
            ctaLabel: model.ctaLabel,
            onAction: (id) => Actioned({ id }),
            onCta: Actioned({ id: "cta" }),
            onItem: (id) => Actioned({ id }),
            prompt: model.prompt,
          },
          h,
        ),
      ],
    ),
} as const;

const args = { ctaLabel: "Sign up", prompt: "New in Siglata" } as const;

export default {
  ...componentMeta("menu-4-col-with-footer"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu 4 Col With Footer",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menu4ColWithFooter<Message>>[1]) =>
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
