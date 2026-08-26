import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { filterCommandGroups } from "../src/application/command-menu.ts";

const groups = [
  {
    id: "actions",
    items: [
      { description: "Create a report", id: "new", label: "New Robot" },
      { description: "Open preferences", id: "settings", label: "Settings" },
    ],
    title: "Actions",
  },
] as const;

describe("command menu", () => {
  it("filters labels and descriptions without case or accents", () => {
    expect(filterCommandGroups(groups, "robot")[0]?.items.map((item) => item.id)).toEqual(["new"]);
    expect(filterCommandGroups(groups, "PREFERENCES")[0]?.items.map((item) => item.id)).toEqual([
      "settings",
    ]);
  });

  it("removes empty groups and preserves the unfiltered source", () => {
    expect(filterCommandGroups(groups, "missing")).toEqual([]);
    expect(filterCommandGroups(groups, "")).toBe(groups);
  });
});
