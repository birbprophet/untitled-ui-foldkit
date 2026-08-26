import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { EmailInviteModalProps } from "../src/application/email-invite-modal.ts";

describe("email invite modal", () => {
  it("keeps email fields and actions controlled", () => {
    const props: EmailInviteModalProps<string> = {
      emails: ["", ""],
      id: "invite-collaborators",
      isOpen: true,
      onAddAnother: "add",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onEmailInput: (index, value) => `${String(index)}:${value}`,
      onSendInvites: "send",
    };
    expect(props.emails).toHaveLength(2);
    expect(props.onEmailInput(1, "olivia@example.com")).toBe("1:olivia@example.com");
  });
});
