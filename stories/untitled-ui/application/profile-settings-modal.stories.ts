/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { profileSettingsModal } from "ui/application";
import type { ProfileSettingsField } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Args = S.Struct({});
const Model = S.Struct({
  introduction: S.String,
  isConsent: S.Boolean,
  isCopied: S.Boolean,
  isDraggingOver: S.Boolean,
  isOpen: S.Boolean,
  username: S.String,
});
type Model = typeof Model.Type;
const Shown = m("ProfileSettingsModalShown");
const Closed = m("ProfileSettingsModalClosed");
type Message =
  | Readonly<{
      _tag: "Cancel" | "Consent" | "Copy" | "Dismiss" | "Publish" | "Upload";
    }>
  | Readonly<{ _tag: "Drag"; isDraggingOver: boolean }>
  | Readonly<{ _tag: "FieldInput"; field: ProfileSettingsField; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowProfileSettingsModal = Command.define("ShowProfileSettingsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseProfileSettingsModal = Command.define("CloseProfileSettingsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (
  tag: "Cancel" | "Consent" | "Copy" | "Dismiss" | "Publish" | "Upload",
): Message => ({ _tag: tag });
const drag = (isDraggingOver: boolean): Message => ({ _tag: "Drag", isDraggingOver });
const fieldInput = (field: ProfileSettingsField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});

const definition = {
  Args,
  Model,
  init: () =>
    [
      {
        introduction: "",
        isConsent: false,
        isCopied: false,
        isDraggingOver: false,
        isOpen: true,
        username: "@oliviarhye",
      } satisfies Model,
      [ShowProfileSettingsModal({ selector: "#profile-settings-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [{ ...model, [next.field]: next.value }, []] as const;
    }
    if (next._tag === "Consent") {
      return [{ ...model, isConsent: !model.isConsent }, []] as const;
    }
    if (next._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    if (next._tag === "Drag") {
      return [{ ...model, isDraggingOver: next.isDraggingOver }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "ProfileSettingsModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Publish"
      ? ([
          updated,
          [CloseProfileSettingsModal({ selector: "#profile-settings-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof profileSettingsModal<Message>>[1]) =>
    profileSettingsModal(
      {
        consent: model.isConsent,
        copied: model.isCopied,
        id: "profile-settings-modal-story",
        introduction: model.introduction,
        isDraggingOver: model.isDraggingOver,
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onConsent: action("Consent"),
        onCopy: action("Copy"),
        onDismiss: action("Dismiss"),
        onDragState: drag,
        onFieldInput: fieldInput,
        onPublish: action("Publish"),
        onUpload: () => action("Upload"),
        username: model.username,
      },
      h,
    ),
};

const meta = componentMeta("profile-settings-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Profile Settings Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Complete your profile" });
    const username = within(dialog).getByRole("textbox", { name: "Username" });
    await userEvent.clear(username);
    await userEvent.type(username, "@mayachen");
    dialog = await page.findByRole("dialog", { name: "Complete your profile" });
    await expect(within(dialog).getByDisplayValue("@mayachen")).toBeVisible();
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Introduction" }),
      "I build deterministic reports.",
    );
    await userEvent.click(within(dialog).getByRole("checkbox"));
    await expect(within(dialog).getByRole("checkbox")).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Copy link" }));
    await expect(within(dialog).getByRole("button", { name: "Copied" })).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Publish profile" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#profile-settings-modal-story")).toBeNull(),
    );
  },
};
