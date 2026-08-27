/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Pending Storybook interactions and native dialog commands exercise the controlled advanced-filter lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { filtersAdvancedMenu } from "ui/application";
import type {
  FiltersAdvancedControl,
  FiltersAdvancedField,
  FiltersAdvancedOperator,
  FiltersAdvancedRow,
} from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Field = S.Literals(["", "email", "name", "status", "team"]);
const Operator = S.Literals(["contains", "does-not-contain", "equals", "starts-with"]);
const Filter = S.Struct({ field: Field, id: S.String, operator: Operator, value: S.String });
const TeamQuery = S.Struct({ filterId: S.String, value: S.String });
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  filters: S.Array(Filter),
  focusedOptionId: S.optional(S.String),
  isOpen: S.Boolean,
  locale: Locale,
  nextId: S.Finite,
  openControlKey: S.optional(S.String),
  teamQueries: S.Array(TeamQuery),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("FiltersAdvancedMenuShown");
const Closed = m("FiltersAdvancedMenuClosed");
const ControlFocused = m("FiltersAdvancedMenuControlFocused");
const ControlFocusFailed = m("FiltersAdvancedMenuControlFocusFailed");
type Message =
  | Readonly<{ _tag: "Add" | "Apply" | "Clear" | "Dismiss" | "Open" }>
  | Readonly<{
      _tag: "ControlFocus";
      control: FiltersAdvancedControl;
      filterId: string;
      optionId: string;
    }>
  | Readonly<{
      _tag: "ControlOpen";
      control: FiltersAdvancedControl;
      filterId: string;
      isOpen: boolean;
    }>
  | Readonly<{ _tag: "FieldSelect"; field: FiltersAdvancedField; filterId: string }>
  | Readonly<{
      _tag: "OperatorSelect";
      filterId: string;
      operator: FiltersAdvancedOperator;
    }>
  | Readonly<{ _tag: "Remove" | "TeamReset" | "TeamSelectAll"; filterId: string }>
  | Readonly<{ _tag: "TeamQuery" | "ValueInput"; filterId: string; value: string }>
  | Readonly<{ _tag: "TeamToggle"; filterId: string; teamId: string }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ControlFocused.Type
  | typeof ControlFocusFailed.Type;

const ShowFiltersAdvancedMenu = Command.define("ShowFiltersAdvancedMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[autofocus]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseFiltersAdvancedMenu = Command.define("CloseFiltersAdvancedMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const FocusFiltersAdvancedControl = Command.define("FocusFiltersAdvancedControl", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.focus(selector).pipe(
      Effect.match({
        onFailure: () => ControlFocusFailed(),
        onSuccess: () => ControlFocused(),
      }),
    ),
  messages: [ControlFocused, ControlFocusFailed],
});

const simple = (tag: "Add" | "Apply" | "Clear" | "Dismiss" | "Open"): Message => ({ _tag: tag });

const triggerClassName = (initiallyOpen: boolean, isOpen: boolean): string => {
  if (initiallyOpen) {
    return "sr-only";
  }
  return isOpen
    ? "pointer-events-none opacity-0"
    : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
};
const controlFocus = (
  filterId: string,
  control: FiltersAdvancedControl,
  optionId: string,
): Message => ({ _tag: "ControlFocus", control, filterId, optionId });
const controlOpen = (
  filterId: string,
  control: FiltersAdvancedControl,
  isOpen: boolean,
): Message => ({ _tag: "ControlOpen", control, filterId, isOpen });
const fieldSelect = (filterId: string, field: FiltersAdvancedField): Message => ({
  _tag: "FieldSelect",
  field,
  filterId,
});
const operatorSelect = (filterId: string, operator: FiltersAdvancedOperator): Message => ({
  _tag: "OperatorSelect",
  filterId,
  operator,
});
const filterAction = (
  tag: "Remove" | "TeamReset" | "TeamSelectAll",
  filterId: string,
): Message => ({ _tag: tag, filterId });
const filterValue = (
  tag: "TeamQuery" | "ValueInput",
  filterId: string,
  filterText: string,
): Message => ({ _tag: tag, filterId, value: filterText });
const teamToggle = (filterId: string, teamId: string): Message => ({
  _tag: "TeamToggle",
  filterId,
  teamId,
});

const selectedTeams = (serializedTeams: string): readonly string[] =>
  serializedTeams === "" ? [] : serializedTeams.split(",");
const patchFilter = (
  filters: readonly FiltersAdvancedRow[],
  filterId: string,
  patch: Partial<Omit<FiltersAdvancedRow, "id">>,
): readonly FiltersAdvancedRow[] =>
  filters.map((filter) => (filter.id === filterId ? { ...filter, ...patch } : filter));
const queryValue = (model: Model, filterId: string): string =>
  model.teamQueries.find((query) => query.filterId === filterId)?.value ?? "";

const updateModel = (model: Model, next: Message): Model => {
  if (next._tag === "Add") {
    return {
      ...model,
      filters: [
        ...model.filters,
        { field: "", id: `filter-${String(model.nextId)}`, operator: "equals", value: "" },
      ],
      nextId: model.nextId + 1,
    };
  }
  if (next._tag === "Remove") {
    return { ...model, filters: model.filters.filter((filter) => filter.id !== next.filterId) };
  }
  if (next._tag === "Clear") {
    return { ...model, filters: [], openControlKey: undefined, teamQueries: [] };
  }
  if (next._tag === "FieldSelect") {
    return {
      ...model,
      filters: patchFilter(model.filters, next.filterId, { field: next.field, value: "" }),
      openControlKey: undefined,
    };
  }
  if (next._tag === "OperatorSelect") {
    return {
      ...model,
      filters: patchFilter(model.filters, next.filterId, { operator: next.operator }),
      openControlKey: undefined,
    };
  }
  if (next._tag === "ValueInput") {
    return {
      ...model,
      filters: patchFilter(model.filters, next.filterId, { value: next.value }),
    };
  }
  if (next._tag === "TeamToggle") {
    const filter = model.filters.find((candidate) => candidate.id === next.filterId);
    const selected = selectedTeams(filter?.value ?? "");
    const value = selected.includes(next.teamId)
      ? selected.filter((teamId) => teamId !== next.teamId).join(",")
      : [...selected, next.teamId].join(",");
    return { ...model, filters: patchFilter(model.filters, next.filterId, { value }) };
  }
  if (next._tag === "TeamReset") {
    return { ...model, filters: patchFilter(model.filters, next.filterId, { value: "" }) };
  }
  if (next._tag === "TeamSelectAll") {
    return {
      ...model,
      filters: patchFilter(model.filters, next.filterId, {
        value: "engineering,design,product,marketing,sales,customer-success,operations,finance",
      }),
    };
  }
  if (next._tag === "TeamQuery") {
    return {
      ...model,
      teamQueries: [
        ...model.teamQueries.filter((query) => query.filterId !== next.filterId),
        { filterId: next.filterId, value: next.value },
      ],
    };
  }
  if (next._tag === "ControlOpen") {
    return {
      ...model,
      openControlKey: next.isOpen ? `${next.filterId}:${next.control}` : undefined,
    };
  }
  if (next._tag === "ControlFocus") {
    return { ...model, focusedOptionId: next.optionId };
  }
  return {
    ...model,
    isOpen: next._tag === "FiltersAdvancedMenuClosed" ? false : model.isOpen,
  };
};

const emptyDefinition = (initialFilters: readonly FiltersAdvancedRow[], initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        filters: [...initialFilters],
        isOpen: initiallyOpen,
        locale: args.locale,
        nextId: initialFilters.length + 1,
        teamQueries: [],
      } satisfies Model,
      initiallyOpen ? [ShowFiltersAdvancedMenu({ selector: "#filters-advanced-menu-story" })] : [],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowFiltersAdvancedMenu({ selector: "#filters-advanced-menu-story" })],
      ] as const;
    }
    const updated = updateModel(model, next);
    if (next._tag === "ControlOpen" && !next.isOpen) {
      return [
        updated,
        [
          FocusFiltersAdvancedControl({
            selector: `[data-advanced-filter-trigger="${next.filterId}:${next.control}"]`,
          }),
        ],
      ] as const;
    }
    return next._tag === "Apply" || next._tag === "Dismiss"
      ? ([
          updated,
          [CloseFiltersAdvancedMenu({ selector: "#filters-advanced-menu-story" })],
        ] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof filtersAdvancedMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.Class(triggerClassName(initiallyOpen, model.isOpen)),
            h.DataAttribute("filters-advanced-menu-trigger", ""),
            h.OnClick(simple("Open")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir filtros" : "Open filters"],
        ),
        filtersAdvancedMenu(
          {
            filters: model.filters,
            focusedOptionId: model.focusedOptionId,
            id: "filters-advanced-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            onAddFilter: simple("Add"),
            onApply: simple("Apply"),
            onClearAll: simple("Clear"),
            onControlFocus: controlFocus,
            onControlOpenChanged: controlOpen,
            onDismiss: simple("Dismiss"),
            onFieldSelect: fieldSelect,
            onOperatorSelect: operatorSelect,
            onRemoveFilter: (filterId) => filterAction("Remove", filterId),
            onTeamQueryInput: (filterId, value) => filterValue("TeamQuery", filterId, value),
            onTeamReset: (filterId) => filterAction("TeamReset", filterId),
            onTeamSelectAll: (filterId) => filterAction("TeamSelectAll", filterId),
            onTeamToggle: teamToggle,
            onValueInput: (filterId, value) => filterValue("ValueInput", filterId, value),
            openControlKey: model.openControlKey,
            teamQueryFor: (filterId) => queryValue(model, filterId),
          },
          h,
        ),
      ],
    ),
});

const populatedFilters = [
  { field: "email", id: "filter-1", operator: "contains", value: "siglata.com" },
  { field: "team", id: "filter-2", operator: "equals", value: "engineering,design" },
] satisfies readonly FiltersAdvancedRow[];
const empty = emptyDefinition([]);
const populated = emptyDefinition(populatedFilters);
const interactive = emptyDefinition([], false);
const fixture = { locale: "en-US" } satisfies Args;
const meta = componentMeta("filters-advanced-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Filters Advanced Menu",
};
export const AllVariants = { ...liveCommandStory(empty), args: fixture };
export const States = {
  ...liveCommandStory(populated),
  args: fixture,
};
export const Dark = {
  ...liveCommandStory({
    ...populated,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [populated.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = {
  ...liveCommandStory(empty),
  args: fixture,
};
export const Interactions = {
  ...liveCommandStory(interactive),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open filters" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(dialog).toHaveAttribute("dir", "ltr");
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(dialog).getByText("No filters applied")).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Add filter" }));
    const firstFilterField = await page.findByRole(
      "button",
      { name: "Filter field" },
      { timeout: 5000 },
    );
    await userEvent.click(firstFilterField);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(dialog).getByRole("option", { name: "Status" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(within(dialog).getByRole("button", { name: "Filter field" })).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Filter field" }));
    await userEvent.click(await page.findByRole("option", { name: "Team" }, { timeout: 5000 }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Value" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const teamSearch = within(dialog).getByRole("searchbox", { name: "Search" });
    await waitFor(() => expect(teamSearch).toHaveFocus(), { timeout: 5000 });
    await userEvent.type(teamSearch, "zzz");
    await expect(within(dialog).getByText("No results found")).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Clear search" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.type(within(dialog).getByRole("searchbox", { name: "Search" }), "Eng");
    await userEvent.click(within(dialog).getByRole("option", { name: /Engineering/u }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByText("1 selected")).toBeVisible();
    await expect(within(dialog).getByText("8 users")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(within(dialog).getByRole("button", { name: "Value" })).toHaveFocus();

    await userEvent.click(within(dialog).getByRole("button", { name: "Clear all" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByText("No filters applied")).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Add filter" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Filter field" }));
    await userEvent.click(within(dialog).getByRole("option", { name: "Email" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Operator" }));
    await userEvent.click(within(dialog).getByRole("option", { name: "Contains" }));
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await userEvent.type(within(dialog).getByRole("textbox", { name: "Value" }), "siglata.com");
    await waitFor(async () => {
      const current = await page.findByRole("dialog", { name: "Slideout menu" });
      await expect(current).toBeVisible();
      await expect(within(current).getByRole("button", { name: "Filter field" })).toHaveTextContent(
        "Email",
      );
      await expect(within(current).getByRole("button", { name: "Operator" })).toHaveTextContent(
        "Contains",
      );
      await expect(within(current).getByRole("textbox", { name: "Value" })).toHaveValue(
        "siglata.com",
      );
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="filters-advanced-menu-story"] > button',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Slideout menu" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("textbox", { name: "Value" })).toHaveValue("siglata.com");
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
  },
};
