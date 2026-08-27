/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { warningHorizontalModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isHideAgain: S.Boolean, isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("WarningHorizontalModalShown");
const Closed = m("WarningHorizontalModalClosed");
type Message =
  | Readonly<{ _tag: "Discard" | "Dismiss" | "Save" | "Toggle" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowWarningHorizontalModal = Command.define("ShowWarningHorizontalModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-warning-horizontal-close]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseWarningHorizontalModal = Command.define("CloseWarningHorizontalModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Discard" | "Dismiss" | "Save" | "Toggle"): Message => ({ _tag: tag });

const definitionWith = (isHideAgain: boolean) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { isHideAgain, isOpen: true, locale: args.locale } satisfies Model,
      [ShowWarningHorizontalModal({ selector: "#warning-horizontal-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Toggle") {
      return [{ ...model, isHideAgain: !model.isHideAgain }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: message._tag === "WarningHorizontalModalClosed" ? false : model.isOpen,
    };
    return message._tag === "Discard" || message._tag === "Dismiss" || message._tag === "Save"
      ? ([
          updated,
          [CloseWarningHorizontalModal({ selector: "#warning-horizontal-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof warningHorizontalModal<Message>>[1]) =>
    warningHorizontalModal(
      {
        hideAgain: model.isHideAgain,
        id: "warning-horizontal-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onDiscard: action("Discard"),
        onDismiss: action("Dismiss"),
        onSave: action("Save"),
        onToggleHideAgain: action("Toggle"),
      },
      h,
    ),
});

const definition = definitionWith(false);
const meta = componentMeta("warning-horizontal-modal");
const enUs = { locale: "en-US" } satisfies Args;
const ptBr = { locale: "pt-BR" } satisfies Args;
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Warning Horizontal Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: enUs };
export const States = { ...liveCommandStory(definitionWith(true)), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition), args: enUs };
export const Interactions = {
  ...liveCommandStory(definition),
  args: ptBr,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = () => page.findByRole("dialog", { name: "Alterações não salvas" });
    const currentCheckbox = async () =>
      await within(await currentDialog()).findByRole("checkbox", { name: "Não mostrar novamente" });

    await expect(
      within(await currentDialog()).getByRole("button", { name: "Fechar caixa de diálogo" }),
    ).toHaveFocus();
    await expect(await currentCheckbox()).not.toBeChecked();
    await userEvent.click(await currentCheckbox());
    await waitFor(async () => {
      await expect(await currentCheckbox()).toBeChecked();
    });
    await expect(await currentDialog()).toHaveAccessibleDescription(
      "Deseja salvar ou descartar as alterações?",
    );
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Descartar" }),
    ).toBeEnabled();
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Salvar alterações" }),
    ).toBeEnabled();
    await userEvent.tab();
    await userEvent.tab();
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Salvar alterações" }),
    ).toHaveFocus();
  },
};
