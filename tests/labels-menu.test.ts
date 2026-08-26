import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { LabelsMenuLabelId, LabelsMenuProps } from "../src/application/labels-menu.ts";

const allLabelIds: readonly LabelsMenuLabelId[] = [
  "design",
  "product",
  "marketing",
  "management",
  "sales",
  "product-design",
  "operations",
  "customer-success",
  "human-resources",
  "compliance",
  "finance",
];

describe("labels menu", () => {
  it("keeps filtering, selection, label actions, and dismissal controlled", () => {
    const props: LabelsMenuProps<string> = {
      focusedId: "design",
      id: "labels-menu",
      inputValue: "des",
      isOpen: true,
      isPickerOpen: true,
      locale: "pt-BR",
      onAddLabel: "add",
      onApply: "apply",
      onCancel: "cancel",
      onClosePicker: "close-picker",
      onDismiss: "dismiss",
      onFocusOption: (id) => `focus:${id}`,
      onInput: (labelFilter) => `input:${labelFilter}`,
      onManageLabels: "manage",
      onOpenPicker: "open-picker",
      onSearchSelect: (id) => `search:${id}`,
      onToggleLabel: (id) => `toggle:${id}`,
      searchSelectedId: "design",
      selectedIds: ["design", "product", "marketing", "management"],
    };

    expect(props.locale).toBe("pt-BR");
    expect(props.onInput("produto")).toBe("input:produto");
    expect(props.onToggleLabel("product")).toBe("toggle:product");
    expect(props.onSearchSelect("design")).toBe("search:design");
    expect(props.onApply).toBe("apply");
  });

  it("represents unchecked, source-partial, and checked selection without story state", () => {
    const unchecked: readonly LabelsMenuLabelId[] = [];
    const partial: readonly LabelsMenuLabelId[] = ["design", "product", "marketing", "management"];
    const checked = allLabelIds;

    expect(unchecked).toHaveLength(0);
    expect(partial).toEqual(["design", "product", "marketing", "management"]);
    expect(new Set(checked).size).toBe(11);
  });
});
