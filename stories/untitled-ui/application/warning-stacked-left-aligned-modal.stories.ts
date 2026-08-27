/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { warningStackedLeftAlignedModal } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("WarningStackedLeftAlignedModalShown");
const Closed = m("WarningStackedLeftAlignedModalClosed");
type Message =
  | Readonly<{ _tag: "Discard" | "Dismiss" | "Save" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowWarningStackedLeftAlignedModal = Command.define("ShowWarningStackedLeftAlignedModal", {
  args: { focusSelector: S.String, selector: S.String },
  execute: ({ focusSelector, selector }) =>
    Dom.showDialog(selector, { focusSelector }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseWarningStackedLeftAlignedModal = Command.define("CloseWarningStackedLeftAlignedModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Discard" | "Dismiss" | "Save"): Message => ({ _tag: tag });

const definitionWith = (focusSelector: string) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { isOpen: true, locale: args.locale } satisfies Model,
      [
        ShowWarningStackedLeftAlignedModal({
          focusSelector,
          selector: "#warning-stacked-left-aligned-modal-story",
        }),
      ],
    ] as const,
  update: (model: Model, next: Message) => {
    const updated = {
      ...model,
      isOpen: next._tag === "WarningStackedLeftAlignedModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Discard" || next._tag === "Dismiss" || next._tag === "Save"
      ? ([
          updated,
          [
            CloseWarningStackedLeftAlignedModal({
              selector: "#warning-stacked-left-aligned-modal-story",
            }),
          ],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof warningStackedLeftAlignedModal<Message>>[1]) =>
    warningStackedLeftAlignedModal(
      {
        id: "warning-stacked-left-aligned-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onDiscard: action("Discard"),
        onDismiss: action("Dismiss"),
        onSave: action("Save"),
      },
      h,
    ),
});

const closeSelector = "#warning-stacked-left-aligned-modal-story button";
const definition = definitionWith(closeSelector);
const focusedDefinition = definitionWith(
  "#warning-stacked-left-aligned-modal-story > div:last-child button:last-child",
);
const fixture = { locale: "en-US" } satisfies Args;

const meta = componentMeta("warning-stacked-left-aligned-modal");
export default {
  ...meta,
  title: "Untitled UI/Application/Warning Stacked Left Aligned Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(focusedDefinition), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(definition),
  args: { locale: "pt-BR" } satisfies Args,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog", { name: "Alterações não salvas" });
    await expect(
      within(dialog).getByText("Deseja salvar ou descartar as alterações?"),
    ).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
    await userEvent.tab();
    await expect(within(dialog).getByRole("button", { name: "Descartar" })).toHaveFocus();
    await userEvent.tab();
    await expect(within(dialog).getByRole("button", { name: "Salvar alterações" })).toHaveFocus();
  },
};
