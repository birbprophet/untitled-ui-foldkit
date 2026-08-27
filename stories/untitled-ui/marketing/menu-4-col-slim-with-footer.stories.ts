/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises the controlled FoldKit section in the browser. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { menu4ColSlimWithFooter } from "../../../src/marketing/menu-4-col-slim-with-footer.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";
import { marketingMenuFooterActions, marketingMenuItems } from "./marketing-menu-fixtures.ts";

const Args = S.Struct({ ctaLabel: S.String, isFloating: S.Boolean, prompt: S.String });
const Model = Args;
type Model = typeof Model.Type;

const Actioned = m("Menu4ColSlimWithFooterAction", { id: S.String });
type Message = typeof Actioned.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model): Model => model,
  view: (model: Model, h: Parameters<typeof menu4ColSlimWithFooter<Message>>[1]) =>
    h.div(
      [h.Class("-m-8")],
      [
        menu4ColSlimWithFooter(
          {
            actions: marketingMenuFooterActions,
            ctaLabel: model.ctaLabel,
            isFloating: model.isFloating,
            items: marketingMenuItems,
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

const args = {
  ctaLabel: "Sign up",
  isFloating: false,
  prompt: "New in Siglata",
} as const;

export default {
  ...componentMeta("menu-4-col-slim-with-footer"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Header Navigation/Menu 4 Col Slim With Footer",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { ...args, isFloating: true } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model: Model, h: Parameters<typeof menu4ColSlimWithFooter<Message>>[1]) =>
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
