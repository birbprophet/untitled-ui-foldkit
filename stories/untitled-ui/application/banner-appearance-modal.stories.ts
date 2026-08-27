/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook play functions and native dialog commands use promise-based browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { bannerAppearanceModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const BannerAppearance = S.Literals(["default", "simplified", "none", "custom"]);
const Args = S.Struct({ appearance: BannerAppearance });
const Model = S.Struct({ appearance: BannerAppearance, isOpen: S.Boolean });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const DialogShown = m("BannerAppearanceDialogShown");
const DialogClosed = m("BannerAppearanceDialogClosed");
const AppearanceChanged = m("BannerAppearanceChanged", { appearance: BannerAppearance });
type Message =
  | Readonly<{ _tag: "Cancel" | "Dismiss" | "EditCss" | "Help" | "Save" }>
  | typeof DialogShown.Type
  | typeof DialogClosed.Type
  | typeof AppearanceChanged.Type;
const simple = (tag: "Cancel" | "Dismiss" | "EditCss" | "Help" | "Save"): Message => ({
  _tag: tag,
});

const ShowBannerAppearanceDialog = Command.define("ShowBannerAppearanceDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => DialogShown(), onSuccess: () => DialogShown() }),
    ),
  messages: [DialogShown],
});

const CloseBannerAppearanceDialog = Command.define("CloseBannerAppearanceDialog", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => DialogClosed(), onSuccess: () => DialogClosed() }),
    ),
  messages: [DialogClosed],
});

const fixture = { appearance: "simplified" } satisfies Args;

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { ...args, isOpen: true } satisfies Model,
      [ShowBannerAppearanceDialog({ selector: "#banner-appearance-modal-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    const next: Model = {
      ...model,
      appearance:
        message._tag === "BannerAppearanceChanged" ? message.appearance : model.appearance,
      isOpen: message._tag === "BannerAppearanceDialogClosed" ? false : model.isOpen,
    };
    return message._tag === "Cancel" || message._tag === "Dismiss" || message._tag === "Save"
      ? ([
          next,
          [CloseBannerAppearanceDialog({ selector: "#banner-appearance-modal-story" })],
        ] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof bannerAppearanceModal<Message>>[1]) =>
    bannerAppearanceModal(
      {
        appearance: model.appearance,
        id: "banner-appearance-modal-story",
        isOpen: model.isOpen,
        onAppearance: (appearance) => AppearanceChanged({ appearance }),
        onCancel: simple("Cancel"),
        onDismiss: simple("Dismiss"),
        onEditCss: simple("EditCss"),
        onHelp: simple("Help"),
        onSave: simple("Save"),
      },
      h,
    ),
};

export default {
  ...componentMeta("banner-appearance-modal"),
  title: "Untitled UI/Application/Banner Appearance Modal",
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
    const dialog = await canvas.findByRole("dialog", { name: "Banner appearance" });
    await expect(dialog).toBeVisible();
    await expect(await canvas.findByRole("button", { name: "Close dialog" })).toHaveFocus();
    await userEvent.click(await canvas.findByRole("radio", { name: "Default" }));
    await expect(await canvas.findByRole("radio", { name: "Default" })).toBeChecked();
    await userEvent.click(await canvas.findByRole("radio", { name: "Custom styling" }));
    await expect(await canvas.findByRole("radio", { name: "Custom styling" })).toBeChecked();
    await userEvent.click(await canvas.findByRole("button", { name: "Edit CSS" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
