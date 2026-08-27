/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { newMessageEmptyStateModal } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const contacts = [
  {
    avatarSeed: "phoenix-baker",
    id: "@phoenix",
    label: "Phoenix Baker",
    supportingText: "@phoenix",
  },
  { avatarSeed: "olivia-rhye", id: "@olivia", label: "Olivia Rhye", supportingText: "@olivia" },
  { avatarSeed: "lana-steiner", id: "@lana", label: "Lana Steiner", supportingText: "@lana" },
  { avatarSeed: "demi-wilkinson", id: "@demi", label: "Demi Wilkinson", supportingText: "@demi" },
  { avatarSeed: "candice-wu", id: "@candice", label: "Candice Wu", supportingText: "@candice" },
  { avatarSeed: "natali-craig", id: "@natali", label: "Natali Craig", supportingText: "@natali" },
] as const;
const accounts = [
  { avatarSeed: "olivia-rhye", id: "olivia", label: "Olivia Rhye" },
  { avatarSeed: "sienna-hewitt", id: "sienna", label: "Sienna Hewitt" },
] as const;

const Args = S.Struct({});
const Model = S.Struct({
  accountMenuOpen: S.Boolean,
  body: S.String,
  ccFocusedId: S.optional(S.String),
  ccInput: S.String,
  ccOpen: S.Boolean,
  ccSelectedIds: S.Array(S.String),
  isOpen: S.Boolean,
  selectedAccountId: S.String,
  subject: S.String,
  toFocusedId: S.optional(S.String),
  toInput: S.String,
  toOpen: S.Boolean,
  toSelectedIds: S.Array(S.String),
});
type Model = typeof Model.Type;
const Shown = m("NewMessageEmptyModalShown");
const Closed = m("NewMessageEmptyModalClosed");
type Field = "to" | "cc";
type Message =
  | Readonly<{
      _tag:
        | "AccountMenuToggle"
        | "Attach"
        | "Dismiss"
        | "Discard"
        | "Save"
        | "Schedule"
        | "Send"
        | "SendLater"
        | "UseSnippet";
    }>
  | Readonly<{ _tag: "AccountSelect"; id: string }>
  | Readonly<{ _tag: "BodyInput" | "SubjectInput"; value: string }>
  | Readonly<{ _tag: "RecipientClose" | "RecipientOpen"; field: Field }>
  | Readonly<{
      _tag: "RecipientFocus" | "RecipientRemove" | "RecipientSelect";
      field: Field;
      id: string;
    }>
  | Readonly<{ _tag: "RecipientInput"; field: Field; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowNewMessageEmptyModal = Command.define("ShowNewMessageEmptyModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseNewMessageEmptyModal = Command.define("CloseNewMessageEmptyModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (
  tag:
    | "AccountMenuToggle"
    | "Attach"
    | "Dismiss"
    | "Discard"
    | "Save"
    | "Schedule"
    | "Send"
    | "SendLater"
    | "UseSnippet",
): Message => ({ _tag: tag });
const initialModel = {
  accountMenuOpen: false,
  body: "",
  ccFocusedId: undefined,
  ccInput: "",
  ccOpen: false,
  ccSelectedIds: [],
  isOpen: true,
  selectedAccountId: "olivia",
  subject: "",
  toFocusedId: undefined,
  toInput: "",
  toOpen: false,
  toSelectedIds: [],
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () =>
    [
      initialModel,
      [ShowNewMessageEmptyModal({ selector: "#new-message-empty-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "BodyInput" || next._tag === "SubjectInput") {
      return [
        { ...model, [next._tag === "BodyInput" ? "body" : "subject"]: next.value },
        [],
      ] as const;
    }
    if (next._tag === "RecipientInput") {
      return [
        { ...model, [`${next.field}Input`]: next.value, [`${next.field}Open`]: true },
        [],
      ] as const;
    }
    if (next._tag === "RecipientOpen" || next._tag === "RecipientClose") {
      return [{ ...model, [`${next.field}Open`]: next._tag === "RecipientOpen" }, []] as const;
    }
    if (next._tag === "RecipientFocus") {
      return [{ ...model, [`${next.field}FocusedId`]: next.id }, []] as const;
    }
    if (next._tag === "RecipientSelect" || next._tag === "RecipientRemove") {
      const selected = next.field === "to" ? model.toSelectedIds : model.ccSelectedIds;
      const nextSelected =
        next._tag === "RecipientSelect"
          ? selected.includes(next.id)
            ? selected
            : [...selected, next.id]
          : selected.filter((id) => id !== next.id);
      return next.field === "to"
        ? ([{ ...model, toInput: "", toOpen: false, toSelectedIds: nextSelected }, []] as const)
        : ([{ ...model, ccInput: "", ccOpen: false, ccSelectedIds: nextSelected }, []] as const);
    }
    if (next._tag === "AccountMenuToggle") {
      return [{ ...model, accountMenuOpen: !model.accountMenuOpen }, []] as const;
    }
    if (next._tag === "AccountSelect") {
      return [{ ...model, accountMenuOpen: false, selectedAccountId: next.id }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "NewMessageEmptyModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Dismiss" ||
      next._tag === "Discard" ||
      next._tag === "Send" ||
      next._tag === "SendLater"
      ? ([
          updated,
          [CloseNewMessageEmptyModal({ selector: "#new-message-empty-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof newMessageEmptyStateModal<Message>>[1]) =>
    newMessageEmptyStateModal(
      {
        ...model,
        accounts,
        contacts,
        id: "new-message-empty-modal-story",
        onAccountMenuToggle: action("AccountMenuToggle"),
        onAccountSelect: (id): Message => ({ _tag: "AccountSelect", id }),
        onAttach: action("Attach"),
        onBodyInput: (value): Message => ({ _tag: "BodyInput", value }),
        onDiscard: action("Discard"),
        onDismiss: action("Dismiss"),
        onRecipientClose: (field): Message => ({ _tag: "RecipientClose", field }),
        onRecipientFocus: (field, id): Message => ({ _tag: "RecipientFocus", field, id }),
        onRecipientInput: (field, value): Message => ({ _tag: "RecipientInput", field, value }),
        onRecipientOpen: (field): Message => ({ _tag: "RecipientOpen", field }),
        onRecipientRemove: (field, id): Message => ({ _tag: "RecipientRemove", field, id }),
        onRecipientSelect: (field, id): Message => ({ _tag: "RecipientSelect", field, id }),
        onSave: action("Save"),
        onSchedule: action("Schedule"),
        onSend: action("Send"),
        onSendLater: action("SendLater"),
        onSubjectInput: (value): Message => ({ _tag: "SubjectInput", value }),
        onUseSnippet: action("UseSnippet"),
      },
      h,
    ),
};

const meta = componentMeta("new-message-empty-state-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/New Message Empty State Modal",
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
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "New message" });
    const to = within(dialog).getByRole("combobox", { name: "TO" });
    await userEvent.click(to);
    await userEvent.type(to, "Phoenix");
    await userEvent.click(within(dialog).getByRole("option", { name: /Phoenix Baker/u }));
    await expect(
      within(dialog).getByRole("button", { name: "Remove Phoenix Baker" }),
    ).toBeVisible();
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Subject" }),
      "Quarterly report",
    );
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Message" }),
      "Hello from Siglata.",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Send" }));
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector("#new-message-empty-modal-story"),
      ).toBeNull(),
    );
  },
};
