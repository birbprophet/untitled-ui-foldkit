import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { NewMessageFilledModalProps } from "../src/application/new-message-filled-modal.ts";

const message = (value: string): string => value;

describe("new message filled modal", () => {
  it("keeps compose, upload, and recipient state controlled", () => {
    const props: NewMessageFilledModalProps<string> = {
      accountMenuOpen: false,
      accounts: [
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%237f56d9'/%3E%3C/svg%3E",
          id: "olivia",
          label: "Olivia Rhye",
        },
      ],
      attachments: [{ id: "brief", name: "brief.pdf", progress: 40, size: 12_000_000 }],
      bodyHtml: "<p>Hello</p>",
      bodySelection: {
        align: "left",
        bold: false,
        bulletList: false,
        color: "#181D27",
        fontFamily: "Inter",
        fontSize: "16px",
        italic: false,
        link: false,
        underline: false,
      },
      bodyText: "Hello",
      ccInput: "",
      ccOpen: false,
      ccSelectedIds: [],
      contacts: [],
      id: "filled-composer",
      isDraggingOver: false,
      isOpen: true,
      onAccountMenuToggle: "account-menu",
      onAccountSelect: message,
      onAttachmentRemove: message,
      onBodyChange: (change) => change.html,
      onBodyCommand: (request) => request.command,
      onBodySelectionChange: (selection) => selection.align,
      onDiscard: "discard",
      onDismiss: "dismiss",
      onDragStateChange: String,
      onFilesSelected: (files) => String(files.length),
      onRecipientClose: message,
      onRecipientFocus: (field, id) => `${field}:${id}`,
      onRecipientInput: (field, value) => `${field}:${value}`,
      onRecipientOpen: message,
      onRecipientRemove: (field, id) => `${field}:${id}`,
      onRecipientSelect: (field, id) => `${field}:${id}`,
      onSave: "save",
      onSchedule: "schedule",
      onSend: "send",
      onSendLater: "send-later",
      onSubjectInput: message,
      onUseSnippet: "snippet",
      selectedAccountId: "olivia",
      subject: "Quarterly report",
      toInput: "",
      toOpen: false,
      toSelectedIds: [],
    };
    expect(props.onAttachmentRemove("brief")).toBe("brief");
    expect(props.onBodyChange({ html: "<p>Changed</p>", text: "Changed" })).toBe("<p>Changed</p>");
  });
});
