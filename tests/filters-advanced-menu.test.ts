import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  FiltersAdvancedControl,
  FiltersAdvancedField,
  FiltersAdvancedLocale,
  FiltersAdvancedMenuProps,
  FiltersAdvancedOperator,
  FiltersAdvancedRow,
} from "../src/application/filters-advanced-menu.ts";

describe("filters advanced menu", () => {
  it("keeps rows, nested controls, and slideout actions controlled", () => {
    const filters: readonly FiltersAdvancedRow[] = [
      { field: "team", id: "filter-1", operator: "equals", value: "engineering,design" },
    ];
    const props: FiltersAdvancedMenuProps<string> = {
      filters,
      focusedOptionId: "engineering",
      id: "advanced-filters",
      isOpen: true,
      locale: "en-US",
      onAddFilter: "add",
      onApply: "apply",
      onClearAll: "clear",
      onControlFocus: (filterId, control, optionId) => `${filterId}:${control}:focus:${optionId}`,
      onControlOpenChanged: (filterId, control, open) => `${filterId}:${control}:${String(open)}`,
      onDismiss: "dismiss",
      onFieldSelect: (filterId, field) => `${filterId}:field:${field}`,
      onOperatorSelect: (filterId, operator) => `${filterId}:operator:${operator}`,
      onRemoveFilter: (filterId) => `${filterId}:remove`,
      onTeamQueryInput: (filterId, value) => `${filterId}:query:${value}`,
      onTeamReset: (filterId) => `${filterId}:reset`,
      onTeamSelectAll: (filterId) => `${filterId}:all`,
      onTeamToggle: (filterId, teamId) => `${filterId}:team:${teamId}`,
      onValueInput: (filterId, value) => `${filterId}:value:${value}`,
      openControlKey: "filter-1:team",
      teamQueryFor: () => "eng",
    };

    expect(props.filters).toEqual(filters);
    expect(props.onControlOpenChanged("filter-1", "team", true)).toBe("filter-1:team:true");
    expect(props.onControlFocus("filter-1", "team", "engineering")).toBe(
      "filter-1:team:focus:engineering",
    );
    expect(props.onTeamToggle("filter-1", "engineering")).toBe("filter-1:team:engineering");
    expect(props.onApply).toBe("apply");
    expect(props.onDismiss).toBe("dismiss");
  });

  it("preserves the authenticated field, operator, control, and fixture ids", () => {
    const fields: readonly FiltersAdvancedField[] = ["status", "email", "team", "name"];
    const operators: readonly FiltersAdvancedOperator[] = [
      "equals",
      "contains",
      "does-not-contain",
      "starts-with",
    ];
    const controls: readonly FiltersAdvancedControl[] = ["field", "operator", "team"];
    const teams = [
      "engineering",
      "design",
      "product",
      "marketing",
      "sales",
      "customer-success",
      "operations",
      "finance",
    ];

    expect(fields).toEqual(["status", "email", "team", "name"]);
    expect(operators).toHaveLength(4);
    expect(controls).toEqual(["field", "operator", "team"]);
    expect(teams).toHaveLength(8);
  });

  it("supports both left-to-right locale variants", () => {
    const locales: readonly FiltersAdvancedLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
