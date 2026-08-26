import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { TreeViewProps } from "../src/application/tree-view.ts";

describe("application tree view", () => {
  it("keeps expansion, selection, focus, and drag state controlled", () => {
    const props: TreeViewProps<string> & Readonly<{ draggable: boolean }> = {
      draggable: true,
      expandedIds: ["engineering"],
      focusedId: "design",
      label: "Organization",
      nodes: [
        { children: [{ id: "design", label: "Design" }], id: "engineering", label: "Engineering" },
      ],
      onDragEnd: (id) => `drag-end:${id}`,
      onDragStart: (id) => `drag-start:${id}`,
      onDrop: (source, target) => `drop:${source}:${target}`,
      onExpandedChange: (id, expanded) => `expand:${id}:${String(expanded)}`,
      onFocusChange: (id) => `focus:${id}`,
      onSelectionChange: (ids, selected) => `select:${ids.join(",")}:${String(selected)}`,
      selectedIds: ["design"],
      selectionMode: "multiple",
    };
    expect(props.onExpandedChange("engineering", false)).toBe("expand:engineering:false");
    expect(props.onSelectionChange?.(["engineering", "design"], true)).toBe(
      "select:engineering,design:true",
    );
    expect(props.onDrop?.("design", "engineering")).toBe("drop:design:engineering");
  });
});
