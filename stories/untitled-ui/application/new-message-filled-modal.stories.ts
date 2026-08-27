/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/no-length-comparison, mps/require-is-prefix-for-boolean-schema-field, typescript/no-deprecated -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { newMessageFilledModal } from "../../../src/application.ts";
import type { NewMessageRecipientField } from "../../../src/application.ts";
import type {
  TextEditorChange,
  TextEditorCommandRequest,
  TextEditorSelection,
} from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const contacts = [
  {
    avatarUrl: agentFace("Mathilde Lewis"),
    id: "mathilde",
    label: "mathilde@siglata.com",
    supportingText: "Mathilde",
  },
  {
    avatarUrl: agentFace("Caitlyn King"),
    id: "caitlyn",
    label: "caitlyn@siglata.com",
    supportingText: "Caitlyn",
  },
  {
    avatarUrl: agentFace("Ammar Foley"),
    id: "ammar",
    label: "ammar@siglata.com",
    supportingText: "Ammar",
  },
  {
    avatarUrl: agentFace("Phoenix Baker"),
    id: "phoenix",
    label: "phoenix@siglata.com",
    supportingText: "Phoenix",
  },
  {
    avatarUrl: agentFace("Olivia Rhye"),
    id: "olivia",
    label: "olivia@siglata.com",
    supportingText: "Olivia",
  },
  {
    avatarUrl: agentFace("Lana Steiner"),
    id: "lana",
    label: "lana@siglata.com",
    supportingText: "Lana",
  },
  {
    avatarUrl: agentFace("Demi Wilkinson"),
    id: "demi",
    label: "demi@siglata.com",
    supportingText: "Demi",
  },
  {
    avatarUrl: agentFace("Candice Wu"),
    id: "candice",
    label: "candice@siglata.com",
    supportingText: "Candice",
  },
  {
    avatarUrl: agentFace("Natali Craig"),
    id: "natali",
    label: "natali@siglata.com",
    supportingText: "Natali",
  },
] as const;
const accounts = [
  { avatarUrl: agentFace("Olivia Rhye"), id: "olivia", label: "Olivia Rhye" },
  { avatarUrl: agentFace("Sienna Hewitt"), id: "sienna", label: "Sienna Hewitt" },
] as const;
const initialHtml =
  "<p>Hi all,</p><p>I've just wrapped up the first round of copy edits for the launch landing page. Next step is to review the staging link and confirm the timings before we hand everything over to development.</p><p>If you spot anything that feels off or missing, just drop me a note!</p><p>Thanks,<br>Sienna</p>";
const initialText =
  "Hi all,I've just wrapped up the first round of copy edits for the launch landing page. Next step is to review the staging link and confirm the timings before we hand everything over to development.If you spot anything that feels off or missing, just drop me a note!Thanks,Sienna";

const Selection = S.Struct({
  align: S.Literals(["center", "left", "right"]),
  bold: S.Boolean,
  bulletList: S.Boolean,
  color: S.String,
  fontFamily: S.String,
  fontSize: S.String,
  italic: S.Boolean,
  link: S.Boolean,
  underline: S.Boolean,
});
const Attachment = S.Struct({ id: S.String, name: S.String, progress: S.Number, size: S.Number });
const Args = S.Struct({});
const Model = S.Struct({
  accountMenuOpen: S.Boolean,
  attachments: S.Array(Attachment),
  bodyHtml: S.String,
  bodySelection: Selection,
  bodyText: S.String,
  ccFocusedId: S.optional(S.String),
  ccInput: S.String,
  ccOpen: S.Boolean,
  ccSelectedIds: S.Array(S.String),
  isDraggingOver: S.Boolean,
  isOpen: S.Boolean,
  selectedAccountId: S.String,
  subject: S.String,
  toFocusedId: S.optional(S.String),
  toInput: S.String,
  toOpen: S.Boolean,
  toSelectedIds: S.Array(S.String),
});
type Model = typeof Model.Type;
const Shown = m("NewMessageFilledModalShown");
const Closed = m("NewMessageFilledModalClosed");
type Message =
  | Readonly<{
      _tag:
        | "AccountMenuToggle"
        | "Dismiss"
        | "Discard"
        | "Save"
        | "Schedule"
        | "Send"
        | "SendLater"
        | "UseSnippet";
    }>
  | Readonly<{ _tag: "AccountSelect" | "AttachmentRemove"; id: string }>
  | Readonly<{ _tag: "BodyChange"; change: TextEditorChange }>
  | Readonly<{ _tag: "BodyCommand"; request: TextEditorCommandRequest }>
  | Readonly<{ _tag: "BodySelection"; selection: TextEditorSelection }>
  | Readonly<{ _tag: "DragState"; isDraggingOver: boolean }>
  | Readonly<{ _tag: "FilesSelected"; files: readonly File[] }>
  | Readonly<{ _tag: "RecipientClose" | "RecipientOpen"; field: NewMessageRecipientField }>
  | Readonly<{
      _tag: "RecipientFocus" | "RecipientRemove" | "RecipientSelect";
      field: NewMessageRecipientField;
      id: string;
    }>
  | Readonly<{ _tag: "RecipientInput"; field: NewMessageRecipientField; value: string }>
  | Readonly<{ _tag: "SubjectInput"; value: string }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowNewMessageFilledModal = Command.define("ShowNewMessageFilledModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseNewMessageFilledModal = Command.define("CloseNewMessageFilledModal", {
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
    | "Dismiss"
    | "Discard"
    | "Save"
    | "Schedule"
    | "Send"
    | "SendLater"
    | "UseSnippet",
): Message => ({ _tag: tag });
const initialSelection: TextEditorSelection = {
  align: "left",
  bold: false,
  bulletList: false,
  color: "#181D27",
  fontFamily: "Inter",
  fontSize: "16px",
  italic: false,
  link: false,
  underline: false,
};
const initialModel = {
  accountMenuOpen: false,
  attachments: [
    { id: "1", name: "Q3_brief_final.pdf", progress: 100, size: 2_400_000 },
    { id: "2", name: "Q3_launch_assets.zip", progress: 40, size: 12_000_000 },
  ],
  bodyHtml: initialHtml,
  bodySelection: initialSelection,
  bodyText: initialText,
  ccFocusedId: undefined,
  ccInput: "",
  ccOpen: false,
  ccSelectedIds: ["ammar"],
  isDraggingOver: false,
  isOpen: true,
  selectedAccountId: "olivia",
  subject: "Q3 Product Launch Update",
  toFocusedId: undefined,
  toInput: "",
  toOpen: false,
  toSelectedIds: ["mathilde", "caitlyn"],
} satisfies Model;

const definition = {
  Args,
  Model,
  init: () =>
    [
      initialModel,
      [ShowNewMessageFilledModal({ selector: "#new-message-filled-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "BodyChange") {
      return [{ ...model, bodyHtml: next.change.html, bodyText: next.change.text }, []] as const;
    }
    if (next._tag === "BodySelection") {
      return [{ ...model, bodySelection: next.selection }, []] as const;
    }
    if (next._tag === "SubjectInput") {
      return [{ ...model, subject: next.value }, []] as const;
    }
    if (next._tag === "DragState") {
      return [{ ...model, isDraggingOver: next.isDraggingOver }, []] as const;
    }
    if (next._tag === "FilesSelected") {
      const additions = next.files.map((file, index) => ({
        id: `selected-${String(index)}-${file.name}`,
        name: file.name,
        progress: 0,
        size: file.size,
      }));
      return [
        { ...model, attachments: [...model.attachments, ...additions], isDraggingOver: false },
        [],
      ] as const;
    }
    if (next._tag === "AttachmentRemove") {
      return [
        { ...model, attachments: model.attachments.filter((item) => item.id !== next.id) },
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
      isOpen: next._tag === "NewMessageFilledModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Dismiss" ||
      next._tag === "Discard" ||
      next._tag === "Send" ||
      next._tag === "SendLater"
      ? ([
          updated,
          [CloseNewMessageFilledModal({ selector: "#new-message-filled-modal-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof newMessageFilledModal<Message>>[1]) =>
    newMessageFilledModal(
      {
        ...model,
        accounts,
        contacts,
        id: "new-message-filled-modal-story",
        onAccountMenuToggle: action("AccountMenuToggle"),
        onAccountSelect: (id): Message => ({ _tag: "AccountSelect", id }),
        onAttachmentRemove: (id): Message => ({ _tag: "AttachmentRemove", id }),
        onBodyChange: (change): Message => ({ _tag: "BodyChange", change }),
        onBodyCommand: (request): Message => ({ _tag: "BodyCommand", request }),
        onBodySelectionChange: (selection): Message => ({ _tag: "BodySelection", selection }),
        onDiscard: action("Discard"),
        onDismiss: action("Dismiss"),
        onDragStateChange: (isDraggingOver): Message => ({ _tag: "DragState", isDraggingOver }),
        onFilesSelected: (files): Message => ({ _tag: "FilesSelected", files }),
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

const meta = componentMeta("new-message-filled-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/New Message Filled Modal",
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
    await userEvent.clear(within(dialog).getByRole("textbox", { name: "Subject" }));
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Subject" }),
      "Updated launch plan",
    );
    const [removeAttachment] = within(dialog).getAllByRole("button", {
      name: "Remove this tag",
    });
    await expect(removeAttachment).toBeDefined();
    await userEvent.click(removeAttachment ?? dialog);
    await waitFor(() => expect(canvas.queryByText("Q3_brief_final.pdf")).toBeNull());
    const updatedDialog = await canvas.findByRole("dialog", { name: "New message" });
    const upload = within(updatedDialog).getByLabelText("Attach files");
    await userEvent.upload(
      upload,
      new File(["report"], "launch-report.pdf", { type: "application/pdf" }),
    );
    await expect(await canvas.findByText("launch-report.pdf")).toBeVisible();
    const uploadedDialog = await canvas.findByRole("dialog", { name: "New message" });
    await userEvent.click(within(uploadedDialog).getByRole("button", { name: "Send" }));
    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector("#new-message-filled-modal-story"),
      ).toBeNull(),
    );
  },
};
