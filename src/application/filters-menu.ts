/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Authenticated placeholders and controlled native selection preserve the filters-menu anatomy. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { checkbox } from "../base/controls.ts";

export type FiltersMenuLocale = "en-US" | "pt-BR";
export type FiltersMenuSavedFilterId =
  | "product-designers"
  | "backend-developers"
  | "frontend-developers"
  | "fullstack-developers"
  | "product-managers"
  | "qa-engineers";
export type FiltersMenuTeamId =
  | "design"
  | "product-blue"
  | "marketing"
  | "management"
  | "sales"
  | "product-slate"
  | "operations";
export type FiltersMenuRoleId =
  | "backend-developer"
  | "frontend-developer"
  | "fullstack-developer"
  | "product-designer"
  | "product-manager"
  | "qa-engineer"
  | "ux-copywriter"
  | "ux-designer";

export interface FiltersMenuProps<Message> {
  readonly focusedRoleId?: FiltersMenuRoleId;
  readonly focusedSavedFilterId?: FiltersMenuSavedFilterId;
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: FiltersMenuLocale;
  readonly onApply: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onRoleFocus: (roleId: FiltersMenuRoleId) => NoInfer<Message>;
  readonly onRoleQueryInput: (query: string) => NoInfer<Message>;
  readonly onRoleSearchOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onRoleSearchSelect: (roleId: FiltersMenuRoleId) => NoInfer<Message>;
  readonly onRoleToggle: (roleId: FiltersMenuRoleId) => NoInfer<Message>;
  readonly onSaveFilter: NoInfer<Message>;
  readonly onSavedFilterFocus: (filterId: FiltersMenuSavedFilterId) => NoInfer<Message>;
  readonly onSavedFilterOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onSavedFilterSelect: (filterId: FiltersMenuSavedFilterId) => NoInfer<Message>;
  readonly onShowMore: NoInfer<Message>;
  readonly onTeamToggle: (teamId: FiltersMenuTeamId) => NoInfer<Message>;
  readonly roleQuery: string;
  readonly roleSearchOpen: boolean;
  readonly searchedRoleId?: FiltersMenuRoleId;
  readonly selectedRoleIds: readonly FiltersMenuRoleId[];
  readonly selectedSavedFilterId?: FiltersMenuSavedFilterId;
  readonly selectedTeamIds: readonly FiltersMenuTeamId[];
  readonly savedFilterOpen: boolean;
}

const copy = {
  "en-US": {
    apply: "Apply",
    cancel: "Cancel",
    close: "Close",
    description: "Apply filters to table data.",
    filters: "Filters",
    role: "Role",
    save: "Save filter",
    savedPlaceholder: "Select saved filter",
    search: "Search",
    showMore: "Show 10 more",
    slideout: "Slideout menu",
    teams: "Teams",
  },
  "pt-BR": {
    apply: "Aplicar",
    cancel: "Cancelar",
    close: "Fechar",
    description: "Aplique filtros aos dados da tabela.",
    filters: "Filtros",
    role: "Função",
    save: "Salvar filtro",
    savedPlaceholder: "Selecione um filtro salvo",
    search: "Buscar",
    showMore: "Mostrar mais 10",
    slideout: "Menu lateral",
    teams: "Equipes",
  },
} as const;

const savedFilters = {
  "en-US": [
    ["product-designers", "Product designers"],
    ["backend-developers", "Backend developers"],
    ["frontend-developers", "Frontend developers"],
    ["fullstack-developers", "Fullstack developers"],
    ["product-managers", "Product managers"],
    ["qa-engineers", "QA engineers"],
  ],
  "pt-BR": [
    ["product-designers", "Designers de produto"],
    ["backend-developers", "Desenvolvedores de back-end"],
    ["frontend-developers", "Desenvolvedores de front-end"],
    ["fullstack-developers", "Desenvolvedores full-stack"],
    ["product-managers", "Gerentes de produto"],
    ["qa-engineers", "Engenheiros de QA"],
  ],
} as const satisfies Record<
  FiltersMenuLocale,
  readonly (readonly [FiltersMenuSavedFilterId, string])[]
>;

const teams = {
  "en-US": [
    ["design", "Design", "brand"],
    ["product-blue", "Product", "blue"],
    ["marketing", "Marketing", "indigo"],
    ["management", "Management", "pink"],
    ["sales", "Sales", "success"],
    ["product-slate", "Product", "slate"],
    ["operations", "Operations", "sky"],
  ],
  "pt-BR": [
    ["design", "Design", "brand"],
    ["product-blue", "Produto", "blue"],
    ["marketing", "Marketing", "indigo"],
    ["management", "Gestão", "pink"],
    ["sales", "Vendas", "success"],
    ["product-slate", "Produto", "slate"],
    ["operations", "Operações", "sky"],
  ],
} as const satisfies Record<
  FiltersMenuLocale,
  readonly (readonly [
    FiltersMenuTeamId,
    string,
    "brand" | "blue" | "indigo" | "pink" | "success" | "slate" | "sky",
  ])[]
>;

const roles = {
  "en-US": [
    ["backend-developer", "Backend Developer"],
    ["frontend-developer", "Frontend Developer"],
    ["fullstack-developer", "Fullstack Developer"],
    ["product-designer", "Product Designer"],
    ["product-manager", "Product Manager"],
    ["qa-engineer", "QA Engineer"],
    ["ux-copywriter", "UX Copywriter"],
    ["ux-designer", "UX Designer"],
  ],
  "pt-BR": [
    ["backend-developer", "Desenvolvedor de back-end"],
    ["frontend-developer", "Desenvolvedor de front-end"],
    ["fullstack-developer", "Desenvolvedor full-stack"],
    ["product-designer", "Designer de produto"],
    ["product-manager", "Gerente de produto"],
    ["qa-engineer", "Engenheiro de QA"],
    ["ux-copywriter", "Redator de UX"],
    ["ux-designer", "Designer de UX"],
  ],
} as const satisfies Record<FiltersMenuLocale, readonly (readonly [FiltersMenuRoleId, string])[]>;

const icon = <Message>(
  kind: "check" | "close" | "filter" | "search" | "select-check",
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    check: "M11.6666 3.5 5.24992 9.91667 2.33325 7",
    close: "m5 5 10 10M15 5 5 15",
    filter: "M6 12h12M3 6h18M9 18h6",
    search: "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
    "select-check": "m4.5 10 3.5 3.5 7.5-7.5",
  } as const;
  const sizes = {
    check: "size-3",
    close: "size-5",
    filter: "size-5",
    search: "size-5",
    "select-check": "size-5",
  } as const;
  const viewBoxes = {
    check: "0 0 14 14",
    close: "0 0 20 20",
    filter: "0 0 24 24",
    search: "0 0 24 24",
    "select-check": "0 0 20 20",
  } as const;
  return h.svg(
    [h.AriaHidden(true), h.Class(sizes[kind]), h.Fill("none"), h.ViewBox(viewBoxes[kind])],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(kind === "close" || kind === "select-check" ? "1.67" : "2"),
      ]),
    ],
  );
};

const teamCheckbox = <Message>(
  props: FiltersMenuProps<Message>,
  id: FiltersMenuTeamId,
  label: string,
  color: (typeof teams)[FiltersMenuLocale][number][2],
  h: HtmlBuilder<Message>,
): Html => {
  const selected = props.selectedTeamIds.includes(id);
  return h.label(
    [h.Class("flex cursor-pointer items-center gap-2")],
    [
      h.input([
        h.Checked(selected),
        h.Class("peer sr-only"),
        h.Name(`${props.id}-teams`),
        h.OnChange(() => props.onTeamToggle(id)),
        h.Type("checkbox"),
        h.Value(id),
      ]),
      h.span(
        [
          h.Class(
            `relative flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${selected ? "bg-bg-brand-solid text-fg-white ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        selected ? [icon("check", h)] : [],
      ),
      badge({ color, label, size: "md", type: "pill-color" }, h),
    ],
  );
};

const savedFilterOptionSelector = (id: FiltersMenuSavedFilterId): string =>
  `[data-filters-menu-saved-option="${id}"]`;
const roleOptionSelector = (id: FiltersMenuRoleId): string =>
  `[data-filters-menu-role-option="${id}"]`;

const savedFilterSelect = <Message>(
  props: FiltersMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const items = savedFilters[props.locale];
  const selected = items.find(([id]) => id === props.selectedSavedFilterId);
  const focusedIndex = Math.max(
    0,
    props.focusedSavedFilterId === undefined
      ? -1
      : items.findIndex(([id]) => id === props.focusedSavedFilterId),
  );
  const listboxId = `${props.id}-saved-filter-listbox`;
  return h.div(
    [h.Class("relative")],
    [
      h.button(
        [
          h.AriaControls(listboxId),
          h.AriaExpanded(props.savedFilterOpen),
          h.AriaHasPopup("listbox"),
          h.AriaLabel(text.filters),
          h.Class(
            "flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3 py-2 text-md shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.DataAttribute("filters-menu-saved-trigger", ""),
          h.OnClick(props.onSavedFilterOpenChanged(!props.savedFilterOpen)),
          h.OnKeyDownFocus((key) =>
            key === "ArrowDown" && items[0] !== undefined
              ? Option.some({
                  focusSelector: savedFilterOptionSelector(items[0][0]),
                  message: props.onSavedFilterOpenChanged(true),
                })
              : Option.none(),
          ),
          h.Type("button"),
        ],
        [
          h.span([h.Class("shrink-0 text-fg-quaternary")], [icon("filter", h)]),
          h.span(
            [
              h.Class(
                `min-w-0 flex-1 truncate text-left ${selected === undefined ? "text-text-placeholder" : "font-medium text-text-primary"}`,
              ),
            ],
            [selected?.[1] ?? text.savedPlaceholder],
          ),
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("size-4 text-fg-quaternary"),
              h.Fill("none"),
              h.ViewBox("0 0 20 20"),
            ],
            [
              h.path([
                h.D("m5.5 7.5 4.5 4.5 4.5-4.5"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("1.67"),
              ]),
            ],
          ),
        ],
      ),
      h.div(
        [
          h.AriaLabel(text.filters),
          h.Class(
            `${props.savedFilterOpen ? "" : "hidden"} absolute top-full z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Id(listboxId),
          h.Role("listbox"),
        ],
        items.map(([id, label], index) => {
          const isSelected = id === props.selectedSavedFilterId;
          return h.button(
            [
              h.AriaSelected(isSelected),
              h.Class(
                `flex w-full items-center gap-2 rounded-md p-2 pr-2.5 text-left text-md outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 ${isSelected ? "bg-bg-primary-hover" : ""}`,
              ),
              h.DataAttribute("filters-menu-saved-option", id),
              h.OnClick(props.onSavedFilterSelect(id)),
              h.OnKeyDownFocus((key) => {
                if (key === "Escape") {
                  return Option.some({
                    focusSelector: "[data-filters-menu-saved-trigger]",
                    message: props.onSavedFilterOpenChanged(false),
                  });
                }
                let delta = 0;
                if (key === "ArrowDown") {
                  delta = 1;
                }
                if (key === "ArrowUp") {
                  delta = -1;
                }
                if (delta === 0) {
                  return Option.none();
                }
                const next = (index + delta + items.length) % items.length;
                const nextItem = items[next];
                return nextItem === undefined
                  ? Option.none()
                  : Option.some({
                      focusSelector: savedFilterOptionSelector(nextItem[0]),
                      message: props.onSavedFilterFocus(nextItem[0]),
                    });
              }),
              h.Role("option"),
              h.Tabindex(index === focusedIndex ? 0 : -1),
              h.Type("button"),
            ],
            [
              h.span([h.Class("min-w-0 flex-1 truncate font-medium text-text-primary")], [label]),
              ...(isSelected
                ? [h.span([h.Class("text-fg-brand-primary")], [icon("select-check", h)])]
                : []),
            ],
          );
        }),
      ),
    ],
  );
};

const roleCombobox = <Message>(props: FiltersMenuProps<Message>, h: HtmlBuilder<Message>): Html => {
  const text = copy[props.locale];
  const available = roles[props.locale].slice(0, 7);
  const normalizedQuery = props.roleQuery.trim().toLocaleLowerCase(props.locale);
  const visible = available.filter(([, label]) =>
    label.toLocaleLowerCase(props.locale).includes(normalizedQuery),
  );
  const selected = available.find(([id]) => id === props.searchedRoleId);
  const displayValue = props.roleQuery === "" ? (selected?.[1] ?? "") : props.roleQuery;
  const focusedIndex = Math.max(
    0,
    props.focusedRoleId === undefined
      ? -1
      : visible.findIndex(([id]) => id === props.focusedRoleId),
  );
  const inputId = `${props.id}-role-search`;
  const listboxId = `${inputId}-listbox`;
  return h.div(
    [h.Class("relative")],
    [
      h.div(
        [
          h.Class(
            "relative flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3 py-2 shadow-xs ring-1 ring-border-primary ring-inset transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          h.span([h.Class("pointer-events-none shrink-0 text-fg-quaternary")], [icon("search", h)]),
          h.input([
            h.AriaAutocomplete("list"),
            h.AriaControls(listboxId),
            h.AriaExpanded(props.roleSearchOpen),
            h.AriaLabel(text.search),
            h.Class(
              "z-10 w-full appearance-none bg-transparent text-md text-text-primary outline-none caret-fg-primary placeholder:text-text-placeholder",
            ),
            h.Id(inputId),
            h.OnFocus(props.onRoleSearchOpenChanged(true)),
            h.OnInput(props.onRoleQueryInput),
            h.OnKeyDownFocus((key) =>
              key === "ArrowDown" && visible[0] !== undefined
                ? Option.some({
                    focusSelector: roleOptionSelector(visible[0][0]),
                    message: props.onRoleFocus(visible[0][0]),
                  })
                : Option.none(),
            ),
            h.OnKeyDownPreventDefault((key) =>
              key === "Escape" ? Option.some(props.onRoleSearchOpenChanged(false)) : Option.none(),
            ),
            h.Placeholder(text.search),
            h.Role("combobox"),
            h.Type("text"),
            h.Value(displayValue),
          ]),
          h.span(
            [
              h.AriaHidden(true),
              h.Class(
                "absolute inset-y-0.5 right-0.5 z-10 hidden items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pr-2.5 pl-8 md:flex",
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    "pointer-events-none rounded px-1 py-px text-xs font-medium text-text-quaternary ring-1 ring-border-secondary ring-inset select-none",
                  ),
                ],
                ["⌘K"],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [
          h.AriaLabel(text.search),
          h.Class(
            `${props.roleSearchOpen ? "" : "hidden"} absolute top-full z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Id(listboxId),
          h.Role("listbox"),
        ],
        visible.map(([id, label], index) => {
          const isSelected = id === props.searchedRoleId;
          return h.button(
            [
              h.AriaSelected(isSelected),
              h.Class(
                "flex w-full items-center rounded-md py-px px-1.5 outline-focus-ring focus-visible:outline-2 focus-visible:-outline-offset-2",
              ),
              h.DataAttribute("filters-menu-role-option", id),
              h.OnClick(props.onRoleSearchSelect(id)),
              h.OnKeyDownFocus((key) => {
                if (key === "Escape") {
                  return Option.some({
                    focusSelector: `#${inputId}`,
                    message: props.onRoleSearchOpenChanged(false),
                  });
                }
                let delta = 0;
                if (key === "ArrowDown") {
                  delta = 1;
                }
                if (key === "ArrowUp") {
                  delta = -1;
                }
                if (delta === 0) {
                  return Option.none();
                }
                const next = (index + delta + visible.length) % visible.length;
                const nextItem = visible[next];
                return nextItem === undefined
                  ? Option.none()
                  : Option.some({
                      focusSelector: roleOptionSelector(nextItem[0]),
                      message: props.onRoleFocus(nextItem[0]),
                    });
              }),
              h.Role("option"),
              h.Tabindex(index === focusedIndex ? 0 : -1),
              h.Type("button"),
            ],
            [
              h.span(
                [
                  h.Class(
                    `flex w-full cursor-pointer items-center gap-2 rounded-md p-2 pr-2.5 ${isSelected ? "bg-bg-primary-hover" : "hover:bg-bg-primary-hover"}`,
                  ),
                ],
                [
                  h.span(
                    [h.Class("min-w-0 flex-1 truncate text-md font-medium text-text-primary")],
                    [label],
                  ),
                  ...(isSelected
                    ? [h.span([h.Class("text-fg-brand-primary")], [icon("select-check", h)])]
                    : []),
                ],
              ),
            ],
          );
        }),
      ),
    ],
  );
};

export const filtersMenu = <Message>(
  props: FiltersMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
              ),
              h.DataAttribute("filters-menu-overlay", props.id),
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
                  h.Class(
                    "fixed inset-y-0! right-0! left-auto! m-0 h-full w-[calc(100%-1.5rem)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden md:w-full",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
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
                        [h.Class("relative z-1 flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6")],
                        [
                          h.h1(
                            [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                            [text.filters],
                          ),
                          h.p([h.Class("text-sm text-text-tertiary")], [text.description]),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("filters-menu-close", ""),
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
                          savedFilterSelect(props, h),
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [text.teams],
                              ),
                              h.section(
                                [
                                  h.AriaLabel(text.teams),
                                  h.Class("flex flex-col items-start gap-3 pl-2"),
                                ],
                                teams[props.locale].map(([id, label, color]) =>
                                  teamCheckbox(props, id, label, color, h),
                                ),
                              ),
                            ],
                          ),
                          h.div(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [text.role],
                              ),
                              roleCombobox(props, h),
                              h.section(
                                [h.AriaLabel(text.role), h.Class("flex flex-col gap-3 pl-2")],
                                roles[props.locale]
                                  .map(([id, label]) =>
                                    checkbox(
                                      {
                                        isSelected: props.selectedRoleIds.includes(id),
                                        label,
                                        name: `${props.id}-role-${id}`,
                                        onToggle: props.onRoleToggle(id),
                                        value: id,
                                      },
                                      h,
                                    ),
                                  )
                                  .concat(
                                    button(
                                      {
                                        color: "link-color",
                                        label: text.showMore,
                                        onPress: props.onShowMore,
                                        size: "md",
                                      },
                                      h,
                                    ),
                                  ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          h.div(
                            [h.Class("mr-auto")],
                            [
                              button(
                                {
                                  color: "link-color",
                                  label: text.save,
                                  onPress: props.onSaveFilter,
                                  size: "sm",
                                },
                                h,
                              ),
                            ],
                          ),
                          button(
                            {
                              color: "secondary",
                              label: text.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button({ label: text.apply, onPress: props.onApply, size: "sm" }, h),
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
