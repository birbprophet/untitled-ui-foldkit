import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { DropdownModalProps } from "../src/application/dropdown-modal.ts";

describe("dropdown modal", () => {
  it("keeps visibility, selection, and actions controlled", () => {
    const props: DropdownModalProps<string> = {
      id: "published-post",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onFocusPerson: (id) => `focus:${id}`,
      onSelectOpenChanged: (isOpen) => `open:${String(isOpen)}`,
      onSelectPerson: (id) => `select:${id}`,
      selectedPersonId: "@olivia",
    };
    expect(props.selectedPersonId).toBe("@olivia");
    expect(props.onSelectPerson("@phoenix")).toBe("select:@phoenix");
  });
});
