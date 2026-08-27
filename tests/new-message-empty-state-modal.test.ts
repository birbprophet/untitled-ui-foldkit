import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { NewMessageEmptyStateModalProps } from "../src/application/new-message-empty-state-modal.ts";

describe("new message empty state modal", () => {
  it("keeps compose, recipient, and account state controlled", () => {
    const props: NewMessageEmptyStateModalProps<string> = {
      accountMenuOpen: false,
      accounts: [
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%237f56d9'/%3E%3C/svg%3E",
          id: "olivia",
          label: "Olivia Rhye",
        },
      ],
      body: "",
      ccInput: "",
      ccOpen: false,
      ccSelectedIds: [],
      contacts: [
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%239e77ed'/%3E%3C/svg%3E",
          id: "@phoenix",
          label: "Phoenix Baker",
          supportingText: "@phoenix",
        },
      ],
      id: "composer",
      isOpen: true,
      onAccountMenuToggle: "toggle-account",
      onAccountSelect: (id) => `account:${id}`,
      onAttach: "attach",
      onBodyInput: (value) => `body:${value}`,
      onDiscard: "discard",
      onDismiss: "dismiss",
      onRecipientClose: (field) => `close:${field}`,
      onRecipientFocus: (field, id) => `focus:${field}:${id}`,
      onRecipientInput: (field, value) => `input:${field}:${value}`,
      onRecipientOpen: (field) => `open:${field}`,
      onRecipientRemove: (field, id) => `remove:${field}:${id}`,
      onRecipientSelect: (field, id) => `select:${field}:${id}`,
      onSave: "save",
      onSchedule: "schedule",
      onSend: "send",
      onSendLater: "send-later",
      onSubjectInput: (value) => `subject:${value}`,
      onUseSnippet: "snippet",
      selectedAccountId: "olivia",
      subject: "",
      toInput: "",
      toOpen: false,
      toSelectedIds: [],
    };
    expect(props.onRecipientSelect("to", "@phoenix")).toBe("select:to:@phoenix");
    expect(props.onBodyInput("Hello")).toBe("body:Hello");
  });
});
