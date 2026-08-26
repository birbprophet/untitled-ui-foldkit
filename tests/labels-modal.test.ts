import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { LabelsModalProps } from "../src/application/labels-modal.ts";

describe("labels modal", () => {
  it("keeps selection, filtering, removal, and actions controlled", () => {
    const props: LabelsModalProps<string> = {
      id: "labels",
      inputValue: "des",
      isOpen: true,
      isPickerOpen: true,
      onAdd: "add",
      onCancel: "cancel",
      onClosePicker: "close-picker",
      onDismiss: "dismiss",
      onFocusOption: (id) => `focus:${id}`,
      onInput: (labelFilter) => `input:${labelFilter}`,
      onOpenPicker: "open-picker",
      onRemove: (id) => `remove:${id}`,
      onSelect: (id) => `select:${id}`,
      options: [{ color: "indigo", id: "design", label: "Design" }],
      selectedIds: ["design"],
    };
    expect(props.onRemove("design")).toBe("remove:design");
    expect(props.onInput("web")).toBe("input:web");
  });
});
