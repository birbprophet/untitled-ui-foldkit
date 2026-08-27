/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { appearanceSettingsModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const BrandColor = S.Literals([
  "#535862",
  "#099250",
  "#1570EF",
  "#444CE7",
  "#0B7D74",
  "#BA24D5",
  "#DD2590",
  "#E04F16",
  "custom",
]);
const AppearanceMode = S.Literals(["system", "light", "dark"]);
const Args = S.Struct({
  brandColor: BrandColor,
  customColor: S.String,
  isApplyToAllTeams: S.Boolean,
  mode: AppearanceMode,
});
const Model = S.Struct({
  brandColor: BrandColor,
  customColor: S.String,
  isApplyToAllTeams: S.Boolean,
  isOpen: S.Boolean,
  mode: AppearanceMode,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("AppearanceSettingsDialogShown");
const DialogClosed = m("AppearanceSettingsDialogClosed");
const ApplyChanged = m("AppearanceSettingsApplyChanged");
const BrandChanged = m("AppearanceSettingsBrandChanged", { color: BrandColor });
const CustomColorChanged = m("AppearanceSettingsCustomColorChanged", { color: S.String });
const ModeChanged = m("AppearanceSettingsModeChanged", { mode: AppearanceMode });
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "Save" }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type
  | typeof ApplyChanged.Type
  | typeof BrandChanged.Type
  | typeof CustomColorChanged.Type
  | typeof ModeChanged.Type;
const simple = (tag: "Cancel" | "Dismiss" | "Save"): Message => ({ _tag: tag });

const ShowAppearanceSettingsDialog = Command.define("ShowAppearanceSettingsDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseAppearanceSettingsDialog = Command.define("CloseAppearanceSettingsDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const fixture = {
  brandColor: "#0B7D74",
  customColor: "#0B7D74",
  isApplyToAllTeams: false,
  mode: "system",
} satisfies Args;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { ...args, isOpen: true } satisfies Model,
      [ShowAppearanceSettingsDialog({ selector: "#appearance-settings-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    const next: Model = {
      ...model,
      brandColor:
        message._tag === "AppearanceSettingsBrandChanged" ? message.color : model.brandColor,
      customColor:
        message._tag === "AppearanceSettingsCustomColorChanged" ? message.color : model.customColor,
      isApplyToAllTeams:
        message._tag === "AppearanceSettingsApplyChanged"
          ? !model.isApplyToAllTeams
          : model.isApplyToAllTeams,
      isOpen: message._tag === "AppearanceSettingsDialogClosed" ? false : model.isOpen,
      mode: message._tag === "AppearanceSettingsModeChanged" ? message.mode : model.mode,
    };
    return message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Save"
      ? ([
          next,
          [CloseAppearanceSettingsDialog({ selector: "#appearance-settings-modal-story" })],
        ] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof appearanceSettingsModal<Message>>[1]) =>
    appearanceSettingsModal(
      {
        brandColor: model.brandColor,
        customColor: model.customColor,
        id: "appearance-settings-modal-story",
        isApplyToAllTeams: model.isApplyToAllTeams,
        isOpen: model.isOpen,
        mode: model.mode,
        onApplyToAllTeams: ApplyChanged(),
        onBrandColor: (color) => BrandChanged({ color }),
        onCancel: simple("Cancel"),
        onCustomColor: (color) => CustomColorChanged({ color }),
        onDismiss: simple("Dismiss"),
        onMode: (mode) => ModeChanged({ mode }),
        onSave: simple("Save"),
      },
      h,
    ),
};

export default {
  ...componentMeta("appearance-settings-modal"),
  title: "Untitled UI/Application/Appearance Settings Modal",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };

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
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Appearance" });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByRole("button", { name: "Close dialog" })).toHaveFocus();
    await userEvent.click(await canvas.findByRole("radio", { name: "Light mode" }));
    await expect(await canvas.findByRole("radio", { name: "Light mode" })).toBeChecked();
    await userEvent.click(await canvas.findByRole("radio", { name: "Orange" }));
    await expect(await canvas.findByRole("radio", { name: "Orange" })).toBeChecked();
    await userEvent.click(await canvas.findByRole("checkbox", { name: "Apply to all teams" }));
    await expect(await canvas.findByRole("checkbox", { name: "Apply to all teams" })).toBeChecked();
    await userEvent.click(await canvas.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
