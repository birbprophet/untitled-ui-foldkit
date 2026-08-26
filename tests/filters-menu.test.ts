import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  FiltersMenuLocale,
  FiltersMenuProps,
  FiltersMenuRoleId,
  FiltersMenuSavedFilterId,
  FiltersMenuTeamId,
} from "../src/application/filters-menu.ts";

describe("filters menu", () => {
  it("keeps saved filters, teams, roles, and actions controlled", () => {
    const props: FiltersMenuProps<string> = {
      focusedRoleId: "qa-engineer",
      focusedSavedFilterId: "backend-developers",
      id: "filters",
      isOpen: true,
      locale: "en-US",
      onApply: "apply",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onRoleFocus: (id) => `role-focus:${id}`,
      onRoleQueryInput: (query) => `query:${query}`,
      onRoleSearchOpenChanged: (isOpen) => `role-open:${String(isOpen)}`,
      onRoleSearchSelect: (id) => `role-search:${id}`,
      onRoleToggle: (id) => `role-toggle:${id}`,
      onSaveFilter: "save",
      onSavedFilterFocus: (id) => `saved-focus:${id}`,
      onSavedFilterOpenChanged: (isOpen) => `saved-open:${String(isOpen)}`,
      onSavedFilterSelect: (id) => `saved-select:${id}`,
      onShowMore: "show-more",
      onTeamToggle: (id) => `team-toggle:${id}`,
      roleQuery: "QA",
      roleSearchOpen: true,
      savedFilterOpen: false,
      searchedRoleId: "qa-engineer",
      selectedRoleIds: ["product-designer"],
      selectedSavedFilterId: "backend-developers",
      selectedTeamIds: ["design", "product-blue"],
    };

    expect(props.onSavedFilterSelect("product-designers")).toBe("saved-select:product-designers");
    expect(props.onTeamToggle("design")).toBe("team-toggle:design");
    expect(props.onRoleToggle("qa-engineer")).toBe("role-toggle:qa-engineer");
    expect(props.onRoleQueryInput("backend")).toBe("query:backend");
    expect(props.onApply).toBe("apply");
  });

  it("preserves every authenticated fixture id", () => {
    const savedFilters: readonly FiltersMenuSavedFilterId[] = [
      "product-designers",
      "backend-developers",
      "frontend-developers",
      "fullstack-developers",
      "product-managers",
      "qa-engineers",
    ];
    const teams: readonly FiltersMenuTeamId[] = [
      "design",
      "product-blue",
      "marketing",
      "management",
      "sales",
      "product-slate",
      "operations",
    ];
    const roles: readonly FiltersMenuRoleId[] = [
      "backend-developer",
      "frontend-developer",
      "fullstack-developer",
      "product-designer",
      "product-manager",
      "qa-engineer",
      "ux-copywriter",
      "ux-designer",
    ];

    expect(savedFilters).toHaveLength(6);
    expect(teams).toHaveLength(7);
    expect(roles).toHaveLength(8);
  });

  it("supports both left-to-right locale variants", () => {
    const locales: readonly FiltersMenuLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
