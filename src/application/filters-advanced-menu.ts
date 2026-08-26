/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/no-length-comparison, mps/prefer-arr-match -- Real input placeholders, controlled option menus, and authenticated filter branches stay explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type FiltersAdvancedLocale = "en-US" | "pt-BR";
export type FiltersAdvancedField = "" | "email" | "name" | "status" | "team";
export type FiltersAdvancedOperator = "contains" | "does-not-contain" | "equals" | "starts-with";
export type FiltersAdvancedControl = "field" | "operator" | "team";

export interface FiltersAdvancedRow {
  readonly field: FiltersAdvancedField;
  readonly id: string;
  readonly operator: FiltersAdvancedOperator;
  readonly value: string;
}

export interface FiltersAdvancedMenuProps<Message> {
  readonly filters: readonly FiltersAdvancedRow[];
  readonly focusedOptionId?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: FiltersAdvancedLocale;
  readonly onAddFilter: NoInfer<Message>;
  readonly onApply: NoInfer<Message>;
  readonly onClearAll: NoInfer<Message>;
  readonly onControlFocus: (
    filterId: string,
    control: FiltersAdvancedControl,
    optionId: string,
  ) => NoInfer<Message>;
  readonly onControlOpenChanged: (
    filterId: string,
    control: FiltersAdvancedControl,
    isOpen: boolean,
  ) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldSelect: (filterId: string, field: FiltersAdvancedField) => NoInfer<Message>;
  readonly onOperatorSelect: (
    filterId: string,
    operator: FiltersAdvancedOperator,
  ) => NoInfer<Message>;
  readonly onRemoveFilter: (filterId: string) => NoInfer<Message>;
  readonly onTeamQueryInput: (filterId: string, value: string) => NoInfer<Message>;
  readonly onTeamReset: (filterId: string) => NoInfer<Message>;
  readonly onTeamSelectAll: (filterId: string) => NoInfer<Message>;
  readonly onTeamToggle: (filterId: string, teamId: string) => NoInfer<Message>;
  readonly onValueInput: (filterId: string, value: string) => NoInfer<Message>;
  readonly openControlKey?: string;
  readonly teamQueryFor: (filterId: string) => string;
}

const copy = {
  "en-US": {
    add: "Add filter",
    apply: "Apply filter",
    clear: "Clear all",
    clearSearch: "Clear search",
    close: "Close",
    description: "Add filters to narrow down results.",
    empty: "No filters applied",
    field: "Filter field",
    filterPlaceholder: "Select filter",
    noResults: "No results found",
    operator: "Operator",
    remove: "Remove filter",
    reset: "Reset",
    search: "Search",
    selectAll: "Select all",
    selectTeams: "Select teams",
    selectedMany: "selected",
    selectedOne: "selected",
    slideout: "Slideout menu",
    title: "Filters",
    tryDifferent: "Please try a different search term.",
    users: "users",
    value: "Value",
    valuePlaceholder: "Enter a value",
  },
  "pt-BR": {
    add: "Adicionar filtro",
    apply: "Aplicar filtro",
    clear: "Limpar tudo",
    clearSearch: "Limpar busca",
    close: "Fechar",
    description: "Adicione filtros para restringir os resultados.",
    empty: "Nenhum filtro aplicado",
    field: "Campo do filtro",
    filterPlaceholder: "Selecionar filtro",
    noResults: "Nenhum resultado encontrado",
    operator: "Operador",
    remove: "Remover filtro",
    reset: "Redefinir",
    search: "Buscar",
    selectAll: "Selecionar todos",
    selectTeams: "Selecionar equipes",
    selectedMany: "selecionados",
    selectedOne: "selecionado",
    slideout: "Menu lateral",
    title: "Filtros",
    tryDifferent: "Tente usar outro termo de busca.",
    users: "usuários",
    value: "Valor",
    valuePlaceholder: "Insira um valor",
  },
} as const;

const fieldItems = {
  "en-US": [
    ["status", "Status"],
    ["email", "Email"],
    ["team", "Team"],
    ["name", "Name"],
  ],
  "pt-BR": [
    ["status", "Status"],
    ["email", "E-mail"],
    ["team", "Equipe"],
    ["name", "Nome"],
  ],
} as const satisfies Record<
  FiltersAdvancedLocale,
  readonly (readonly [Exclude<FiltersAdvancedField, "">, string])[]
>;

const operatorItems = {
  "en-US": [
    ["equals", "Equals"],
    ["contains", "Contains"],
    ["does-not-contain", "Does not contain"],
    ["starts-with", "Starts with"],
  ],
  "pt-BR": [
    ["equals", "Igual a"],
    ["contains", "Contém"],
    ["does-not-contain", "Não contém"],
    ["starts-with", "Começa com"],
  ],
} as const satisfies Record<
  FiltersAdvancedLocale,
  readonly (readonly [FiltersAdvancedOperator, string])[]
>;

const teamItems = {
  "en-US": [
    ["engineering", "Engineering", 12],
    ["design", "Design", 10],
    ["product", "Product", 6],
    ["marketing", "Marketing", 8],
    ["sales", "Sales", 12],
    ["customer-success", "Customer Success", 4],
    ["operations", "Operations", 2],
    ["finance", "Finance", 2],
  ],
  "pt-BR": [
    ["engineering", "Engenharia", 12],
    ["design", "Design", 10],
    ["product", "Produto", 6],
    ["marketing", "Marketing", 8],
    ["sales", "Vendas", 12],
    ["customer-success", "Sucesso do cliente", 4],
    ["operations", "Operações", 2],
    ["finance", "Finanças", 2],
  ],
} as const satisfies Record<FiltersAdvancedLocale, readonly (readonly [string, string, number])[]>;

const controlKey = (filterId: string, control: FiltersAdvancedControl): string =>
  `${filterId}:${control}`;
const optionSelector = (
  filterId: string,
  control: FiltersAdvancedControl,
  optionId: string,
): string =>
  `[data-advanced-filter="${filterId}"][data-advanced-control="${control}"][data-advanced-option="${optionId}"]`;
const triggerSelector = (filterId: string, control: FiltersAdvancedControl): string =>
  `[data-advanced-filter-trigger="${filterId}:${control}"]`;
const teamSearchSelector = (filterId: string): string =>
  `[data-advanced-team-search="${filterId}"]`;

const icon = <Message>(
  kind: "check" | "chevron" | "close" | "filter" | "plus" | "search",
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    check: "m4.5 10 3.5 3.5 7.5-7.5",
    chevron: "m6 9 6 6 6-6",
    close: "M17 7 7 17M7 7l10 10",
    filter: "M6 12h12M3 6h18M9 18h6",
    plus: "M12 5v14m-7-7h14",
    search: "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  } as const;
  const size =
    kind === "check" || kind === "chevron" || kind === "search"
      ? "size-4 stroke-[2.25px]"
      : "size-5";
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(`${size} ${kind === "check" ? "text-fg-brand-primary" : ""} shrink-0`),
      h.Fill("none"),
      h.ViewBox(kind === "check" ? "0 0 20 20" : "0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(kind === "check" ? "1.67" : "2"),
      ]),
    ],
  );
};

const checkboxCheck = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3 text-fg-white"), h.Fill("none"), h.ViewBox("0 0 14 14")],
    [
      h.path([
        h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const dottedDivider = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("h-0.5 w-full shrink-0")],
    [
      h.line([
        h.X1("0"),
        h.X2("100%"),
        h.Y1("1"),
        h.Y2("1"),
        h.Class("stroke-border-primary"),
        h.Stroke("currentColor"),
        h.StrokeDasharray("0,6"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const moveFocus = <Message>(
  props: FiltersAdvancedMenuProps<Message>,
  filterId: string,
  control: FiltersAdvancedControl,
  optionIds: readonly string[],
  index: number,
  key: string,
) => {
  if (key === "Escape") {
    return Option.some({
      focusSelector: triggerSelector(filterId, control),
      message: props.onControlOpenChanged(filterId, control, false),
    });
  }
  let delta = 0;
  if (key === "ArrowDown") {
    delta = 1;
  }
  if (key === "ArrowUp") {
    delta = -1;
  }
  if (delta === 0 || optionIds.length === 0) {
    return Option.none();
  }
  const next = (index + delta + optionIds.length) % optionIds.length;
  const optionId = optionIds[next];
  return optionId === undefined
    ? Option.none()
    : Option.some({
        focusSelector: optionSelector(filterId, control, optionId),
        message: props.onControlFocus(filterId, control, optionId),
      });
};

const controlSelect = <Message, Id extends string>(
  props: FiltersAdvancedMenuProps<Message>,
  filterId: string,
  control: "field" | "operator",
  items: readonly (readonly [Id, string])[],
  selectedId: string,
  placeholder: string,
  ariaLabel: string,
  onSelect: (id: Id) => NoInfer<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const key = controlKey(filterId, control);
  const isOpen = props.openControlKey === key;
  const listboxId = `${props.id}-${filterId}-${control}-listbox`;
  const selected = items.find(([id]) => id === selectedId);
  const optionIds: readonly string[] = items.map(([id]) => id);
  const focusedIndex = Math.max(
    0,
    props.focusedOptionId === undefined ? -1 : optionIds.indexOf(props.focusedOptionId),
  );
  return h.div(
    [h.Class("relative max-w-40 flex-1")],
    [
      h.button(
        [
          h.AriaControls(listboxId),
          h.AriaExpanded(isOpen),
          h.AriaHasPopup("listbox"),
          h.AriaLabel(ariaLabel),
          h.Class(
            "flex w-full items-center gap-2 rounded-lg bg-bg-primary py-2 pr-2.5 pl-3 text-sm shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.DataAttribute("advanced-filter-trigger", key),
          h.OnClick(props.onControlOpenChanged(filterId, control, !isOpen)),
          h.OnKeyDownFocus((pressed) => {
            if (pressed === "Escape" && isOpen) {
              return Option.some({
                focusSelector: triggerSelector(filterId, control),
                message: props.onControlOpenChanged(filterId, control, false),
              });
            }
            return pressed === "ArrowDown" && optionIds[0] !== undefined
              ? Option.some({
                  focusSelector: optionSelector(filterId, control, optionIds[0]),
                  message: props.onControlOpenChanged(filterId, control, true),
                })
              : Option.none();
          }),
          h.Type("button"),
        ],
        [
          h.span(
            [
              h.Class(
                `min-w-0 flex-1 truncate text-left ${selected === undefined ? "text-text-placeholder" : "font-medium text-text-primary"}`,
              ),
            ],
            [selected?.[1] ?? placeholder],
          ),
          icon("chevron", h),
        ],
      ),
      h.div(
        [
          h.AriaLabel(ariaLabel),
          h.Class(
            `${isOpen ? "" : "hidden"} absolute top-full z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Id(listboxId),
          h.Role("listbox"),
        ],
        items.map(([id, label], index) => {
          const isSelected = id === selectedId;
          return h.button(
            [
              h.AriaSelected(isSelected),
              h.Class(
                `flex w-full items-center gap-2 rounded-md p-2 pr-2.5 text-left text-sm text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 ${isSelected ? "bg-bg-primary-hover" : ""}`,
              ),
              h.DataAttribute("advanced-control", control),
              h.DataAttribute("advanced-filter", filterId),
              h.DataAttribute("advanced-option", id),
              h.OnClickFocus(triggerSelector(filterId, control), onSelect(id)),
              h.OnKeyDownFocus((pressed) =>
                moveFocus(props, filterId, control, optionIds, index, pressed),
              ),
              h.Role("option"),
              h.Tabindex(index === focusedIndex ? 0 : -1),
              h.Type("button"),
            ],
            [
              h.span([h.Class("min-w-0 flex-1 truncate font-medium text-text-primary")], [label]),
              ...(isSelected ? [icon("check", h)] : []),
            ],
          );
        }),
      ),
    ],
  );
};

const teamSelect = <Message>(
  props: FiltersAdvancedMenuProps<Message>,
  filter: FiltersAdvancedRow,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const key = controlKey(filter.id, "team");
  const isOpen = props.openControlKey === key;
  const selectedIds = filter.value === "" ? [] : filter.value.split(",");
  const query = props.teamQueryFor(filter.id);
  const normalizedQuery = query.trim().toLocaleLowerCase(props.locale);
  const teams = teamItems[props.locale];
  const visibleTeams = teams.filter(([, label]) =>
    label.toLocaleLowerCase(props.locale).includes(normalizedQuery),
  );
  const optionIds: readonly string[] = visibleTeams.map(([id]) => id);
  const focusedIndex = Math.max(
    0,
    props.focusedOptionId === undefined ? -1 : optionIds.indexOf(props.focusedOptionId),
  );
  const listboxId = `${props.id}-${filter.id}-team-listbox`;
  return h.div(
    [h.Class("relative min-w-0 flex-1")],
    [
      h.button(
        [
          h.AriaControls(listboxId),
          h.AriaExpanded(isOpen),
          h.AriaHasPopup("listbox"),
          h.AriaLabel(text.value),
          h.Class(
            "flex w-full items-center rounded-lg bg-bg-primary py-2 pr-2.5 pl-3 text-sm shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.DataAttribute("advanced-filter-trigger", key),
          ...(isOpen
            ? [h.OnClick(props.onControlOpenChanged(filter.id, "team", false))]
            : [
                h.OnClickFocus(
                  teamSearchSelector(filter.id),
                  props.onControlOpenChanged(filter.id, "team", true),
                ),
              ]),
          h.OnKeyDownFocus((pressed) => {
            if (pressed === "Escape" && isOpen) {
              return Option.some({
                focusSelector: triggerSelector(filter.id, "team"),
                message: props.onControlOpenChanged(filter.id, "team", false),
              });
            }
            return pressed === "ArrowDown" && optionIds[0] !== undefined
              ? Option.some({
                  focusSelector: optionSelector(filter.id, "team", optionIds[0]),
                  message: props.onControlOpenChanged(filter.id, "team", true),
                })
              : Option.none();
          }),
          h.Type("button"),
        ],
        [
          ...(selectedIds.length === 0
            ? [
                h.span(
                  [h.Class("min-w-0 flex-1 truncate text-left text-text-placeholder")],
                  [text.selectTeams],
                ),
              ]
            : [
                h.span(
                  [h.Class("flex min-w-0 flex-1 items-center gap-1.5 text-left")],
                  [
                    h.span(
                      [h.Class("font-medium text-text-primary")],
                      [
                        `${String(selectedIds.length)} ${selectedIds.length === 1 ? text.selectedOne : text.selectedMany}`,
                      ],
                    ),
                    h.span(
                      [h.Class("text-text-tertiary")],
                      [`${String(teams.length)} ${text.users}`],
                    ),
                  ],
                ),
              ]),
          icon("chevron", h),
        ],
      ),
      h.div(
        [
          h.Class(
            `${isOpen ? "" : "hidden"} absolute top-full z-30 mt-1 w-full overflow-hidden rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
        ],
        [
          h.div(
            [h.Class("border-b border-border-secondary py-1")],
            [
              h.div(
                [h.Class("flex items-center gap-2 px-3 py-2")],
                [
                  h.span([h.Class("text-fg-quaternary")], [icon("search", h)]),
                  h.input([
                    h.AriaLabel(text.search),
                    h.Class(
                      "w-full appearance-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder",
                    ),
                    h.DataAttribute("advanced-team-search", filter.id),
                    h.OnInput((value) => props.onTeamQueryInput(filter.id, value)),
                    h.OnKeyDownFocus((pressed) => {
                      if (pressed === "Escape") {
                        return Option.some({
                          focusSelector: triggerSelector(filter.id, "team"),
                          message: props.onControlOpenChanged(filter.id, "team", false),
                        });
                      }
                      const [first] = optionIds;
                      return pressed === "ArrowDown" && first !== undefined
                        ? Option.some({
                            focusSelector: optionSelector(filter.id, "team", first),
                            message: props.onControlFocus(filter.id, "team", first),
                          })
                        : Option.none();
                    }),
                    h.Placeholder(text.search),
                    h.Type("search"),
                    h.Value(query),
                  ]),
                ],
              ),
            ],
          ),
          h.div(
            [
              h.AriaLabel(text.value),
              h.AriaMultiSelectable(true),
              h.Class("max-h-68 overflow-y-auto py-1"),
              h.Id(listboxId),
              h.Role("listbox"),
            ],
            visibleTeams.length === 0
              ? [
                  h.div(
                    [h.Class("flex flex-col items-center gap-3 px-4 py-4")],
                    [
                      h.div(
                        [h.Class("flex flex-col items-center gap-3")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [icon("search", h)],
                          ),
                          h.div(
                            [h.Class("flex flex-col items-center gap-0.5 text-center text-sm")],
                            [
                              h.p([h.Class("font-semibold text-text-primary")], [text.noResults]),
                              h.p([h.Class("text-text-tertiary")], [text.tryDifferent]),
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "link-color",
                          label: text.clearSearch,
                          onPress: props.onTeamQueryInput(filter.id, ""),
                          size: "sm",
                        },
                        h,
                      ),
                    ],
                  ),
                ]
              : visibleTeams.map(([id, label, users], index) => {
                  const selected = selectedIds.includes(id);
                  return h.button(
                    [
                      h.AriaSelected(selected),
                      h.Class(
                        "flex w-full items-center gap-2 p-2 pr-2.5 text-left text-sm outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:-outline-offset-2",
                      ),
                      h.DataAttribute("advanced-control", "team"),
                      h.DataAttribute("advanced-filter", filter.id),
                      h.DataAttribute("advanced-option", id),
                      h.OnClick(props.onTeamToggle(filter.id, id)),
                      h.OnKeyDownFocus((pressed) =>
                        moveFocus(props, filter.id, "team", optionIds, index, pressed),
                      ),
                      h.Role("option"),
                      h.Tabindex(index === focusedIndex ? 0 : -1),
                      h.Type("button"),
                    ],
                    [
                      h.span(
                        [
                          h.Class(
                            `flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
                          ),
                        ],
                        selected ? [checkboxCheck(h)] : [],
                      ),
                      h.span(
                        [h.Class("min-w-0 flex-1 truncate font-medium text-text-primary")],
                        [label],
                      ),
                      h.span([h.Class("text-text-tertiary")], [`${String(users)} ${text.users}`]),
                    ],
                  );
                }),
          ),
          h.div(
            [h.Class("flex items-center justify-between border-t border-border-secondary p-3")],
            [
              button(
                {
                  color: "secondary",
                  label: text.reset,
                  onPress: props.onTeamReset(filter.id),
                  size: "xs",
                },
                h,
              ),
              button(
                {
                  color: "secondary",
                  label: text.selectAll,
                  onPress: props.onTeamSelectAll(filter.id),
                  size: "xs",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
};

const filterRow = <Message>(
  props: FiltersAdvancedMenuProps<Message>,
  filter: FiltersAdvancedRow,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  return h.div(
    [h.Class("flex flex-col gap-3")],
    [
      h.div(
        [h.Class("flex gap-3")],
        [
          controlSelect(
            props,
            filter.id,
            "field",
            fieldItems[props.locale],
            filter.field,
            text.filterPlaceholder,
            text.field,
            (field) => props.onFieldSelect(filter.id, field),
            h,
          ),
          controlSelect(
            props,
            filter.id,
            "operator",
            operatorItems[props.locale],
            filter.operator,
            text.operator,
            text.operator,
            (operator) => props.onOperatorSelect(filter.id, operator),
            h,
          ),
        ],
      ),
      h.div(
        [h.Class("flex items-start gap-1")],
        [
          ...(filter.field === "team"
            ? [teamSelect(props, filter, h)]
            : [
                h.input([
                  h.AriaLabel(text.value),
                  h.Class(
                    "min-w-0 flex-1 rounded-lg bg-bg-primary py-2 pr-3 pl-3 text-sm text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring placeholder:text-text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnInput((value) => props.onValueInput(filter.id, value)),
                  h.Placeholder(text.valuePlaceholder),
                  h.Type("text"),
                  h.Value(filter.value),
                ]),
              ]),
          h.button(
            [
              h.AriaLabel(text.remove),
              h.Class(
                "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(props.onRemoveFilter(filter.id)),
              h.Type("button"),
            ],
            [icon("close", h)],
          ),
        ],
      ),
    ],
  );
};

export const filtersAdvancedMenu = <Message>(
  props: FiltersAdvancedMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaLabel(text.slideout),
                  h.Attribute("dir", "ltr"),
                  h.Attribute("lang", props.locale),
                  h.Class(
                    "fixed inset-y-0! right-0! left-auto! m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden md:w-full",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full items-start gap-3 px-4 pt-6 md:px-6")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
                              ),
                            ],
                            [icon("filter", h)],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-0.5")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [text.title],
                              ),
                              h.p(
                                [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                                [text.description],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [icon("close", h)],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [
                          dottedDivider(h),
                          ...(props.filters.length === 0
                            ? [
                                h.div(
                                  [h.Class("flex flex-col gap-4")],
                                  [
                                    h.div(
                                      [h.Class("flex max-w-[352px] flex-col gap-1 md:gap-0.5")],
                                      [
                                        h.p(
                                          [
                                            h.Class(
                                              "text-sm font-semibold text-text-primary md:text-md",
                                            ),
                                          ],
                                          [text.empty],
                                        ),
                                        h.p(
                                          [h.Class("text-sm text-text-tertiary")],
                                          [text.description],
                                        ),
                                      ],
                                    ),
                                    h.div(
                                      [],
                                      [
                                        button(
                                          {
                                            color: "secondary",
                                            iconLeadingElement: icon("plus", h),
                                            label: text.add,
                                            onPress: props.onAddFilter,
                                            size: "sm",
                                          },
                                          h,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ]
                            : props.filters.flatMap((filter, index) => [
                                ...(index === 0 ? [] : [dottedDivider(h)]),
                                h.keyed("div")(filter.id, [], [filterRow(props, filter, h)]),
                                ...(index === props.filters.length - 1
                                  ? [
                                      dottedDivider(h),
                                      h.div(
                                        [],
                                        [
                                          button(
                                            {
                                              color: "secondary",
                                              iconLeadingElement: icon("plus", h),
                                              label: text.add,
                                              onPress: props.onAddFilter,
                                              size: "sm",
                                            },
                                            h,
                                          ),
                                        ],
                                      ),
                                    ]
                                  : []),
                              ])),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: text.clear,
                              onPress: props.onClearAll,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: text.apply,
                              onPress: props.onApply,
                              size: "sm",
                            },
                            h,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
