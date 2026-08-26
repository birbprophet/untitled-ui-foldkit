import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { TableProps } from "../src/application/table.ts";

describe("application table", () => {
  it("keeps selection and sorting controlled", () => {
    const props: TableProps<string> = {
      columns: [{ id: "name", label: "Name", sortable: true }],
      onSelectionChange: (rowId, selected) => `${rowId}:${String(selected)}`,
      onSort: (columnId, direction) => `${columnId}:${direction}`,
      rows: [{ cells: { name: { kind: "text", primary: "Olivia" } }, id: "olivia" }],
      selectedIds: ["olivia"],
      sort: { columnId: "name", direction: "ascending" },
    };
    expect(props.onSelectionChange?.("olivia", false)).toBe("olivia:false");
    expect(props.onSort?.("name", "descending")).toBe("name:descending");
    expect(props.selectedIds).toEqual(["olivia"]);
  });
});
