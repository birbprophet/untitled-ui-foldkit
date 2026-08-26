/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, eslint/no-negated-condition, foldkit/keyed-required-for-mapped-rows, mps/avoid-native-object-helpers, mps/casting-awareness, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null, unicorn/no-nested-ternary, unicorn/no-useless-collection-argument -- Controlled table state selects the authenticated native table anatomy without hiding component branches behind an abstraction. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";

export type TableSize = "sm" | "md";
export type TableSortDirection = "ascending" | "descending";

export interface TableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable?: boolean;
  readonly tooltip?: string;
}

export type TableCell =
  | Readonly<{ kind: "badge"; label: string; tone?: "gray" | "success" | "warning" | "error" }>
  | Readonly<{ kind: "progress"; label: string; value: number }>
  | Readonly<{ kind: "text"; primary: string; secondary?: string }>
  | Readonly<{ kind: "user"; name: string; supportingText: string }>;

export interface TableRow {
  readonly cells: Readonly<Record<string, TableCell>>;
  readonly id: string;
}

export interface TableProps<Message> {
  readonly badge?: string;
  readonly columns: readonly TableColumn[];
  readonly description?: string;
  readonly onAction?: (rowId: string, action: "edit" | "copy" | "delete") => Message;
  readonly onActionMenuToggle?: (rowId: string) => Message;
  readonly onSelectAll?: (selected: boolean) => Message;
  readonly onSelectionChange?: (rowId: string, selected: boolean) => Message;
  readonly onSort?: (columnId: string, direction: TableSortDirection) => Message;
  readonly openActionsFor?: string;
  readonly rows: readonly TableRow[];
  readonly selectedIds?: readonly string[];
  readonly size?: TableSize;
  readonly sort?: Readonly<{ columnId: string; direction: TableSortDirection }>;
  readonly title?: string;
}

const checkIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3.5"), h.Fill("none"), h.ViewBox("0 0 14 14")],
    [
      h.path([
        h.D("m3 7 2.5 2.5L11 4"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.7"),
      ]),
    ],
  );

const selectorIcon = <Message>(
  direction: TableSortDirection | undefined,
  h: HtmlBuilder<Message>,
) =>
  direction === undefined
    ? h.svg(
        [h.AriaHidden(true), h.Class("size-3"), h.Fill("none"), h.ViewBox("0 0 12 12")],
        [
          h.path([
            h.D("m3.5 4 2.5-2.5L8.5 4M8.5 8 6 10.5 3.5 8"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.5"),
          ]),
        ],
      )
    : h.svg(
        [
          h.AriaHidden(true),
          h.Class(`size-3 ${direction === "ascending" ? "rotate-180" : ""}`),
          h.Fill("none"),
          h.ViewBox("0 0 12 12"),
        ],
        [
          h.path([
            h.D("M6 2v8m0 0 3-3m-3 3L3 7"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("1.7"),
          ]),
        ],
      );

const helpIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 16 16")],
    [
      h.path([
        h.D(
          "M6.06 6a2 2 0 1 1 2.71 1.87C8.28 8.1 8 8.45 8 9m0 2.67h.007M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.33"),
      ]),
    ],
  );

const checkbox = <Message>(
  label: string,
  checked: boolean,
  onChange: Message | undefined,
  h: HtmlBuilder<Message>,
  indeterminate = false,
): Html =>
  h.label(
    [h.Class("relative flex size-5 items-center justify-center")],
    [
      h.input([
        h.AriaLabel(label),
        h.AriaChecked(indeterminate ? "mixed" : checked),
        h.Checked(checked),
        h.Class("peer absolute inset-0 cursor-pointer opacity-0"),
        ...(onChange === undefined ? [] : [h.OnClick(onChange)]),
        h.Type("checkbox"),
      ]),
      h.span(
        [
          h.AriaHidden(true),
          h.Class(
            `flex size-4.5 items-center justify-center rounded-xs ring-1 transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${indeterminate ? "bg-bg-brand-solid text-white ring-bg-brand-solid" : "bg-bg-primary text-transparent ring-border-primary peer-checked:bg-bg-brand-solid peer-checked:text-white peer-checked:ring-bg-brand-solid"}`,
          ),
        ],
        indeterminate
          ? [h.span([h.Class("h-0.5 w-2.5 rounded-full bg-current")])]
          : checked
            ? [checkIcon(h)]
            : [],
      ),
    ],
  );

const renderCell = <Message>(cell: TableCell, h: HtmlBuilder<Message>): Html => {
  if (cell.kind === "badge") {
    return badge(
      {
        color:
          cell.tone === "success"
            ? "success"
            : cell.tone === "warning"
              ? "warning"
              : cell.tone === "error"
                ? "error"
                : "gray",
        label: cell.label,
        size: "sm",
        type: "color",
      },
      h,
    );
  }
  if (cell.kind === "progress") {
    return h.div(
      [h.Class("flex min-w-36 items-center gap-3")],
      [
        h.div(
          [
            h.AriaLabel(cell.label),
            h.AriaValuemax(100),
            h.AriaValuemin(0),
            h.AriaValuenow(cell.value),
            h.Class("h-2 flex-1 overflow-hidden rounded-full bg-bg-quaternary"),
            h.Role("progressbar"),
          ],
          [
            h.div([
              h.Class("h-full rounded-full bg-bg-brand-solid"),
              h.Style({ width: `${String(Math.max(0, Math.min(100, cell.value)))}%` }),
            ]),
          ],
        ),
        h.span([h.Class("w-8 text-sm text-text-tertiary")], [`${String(cell.value)}%`]),
      ],
    );
  }
  if (cell.kind === "user") {
    return h.div(
      [h.Class("flex items-center gap-3")],
      [
        h.span(
          [
            h.AriaHidden(true),
            h.Class(
              "flex size-10 shrink-0 items-center justify-center rounded-full bg-utility-brand-50 text-sm font-semibold text-text-brand-secondary ring-1 ring-utility-brand-200",
            ),
          ],
          [
            cell.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join(""),
          ],
        ),
        h.div(
          [h.Class("min-w-0")],
          [
            h.p([h.Class("truncate text-sm font-medium text-text-primary")], [cell.name]),
            h.p([h.Class("truncate text-sm text-text-tertiary")], [cell.supportingText]),
          ],
        ),
      ],
    );
  }
  return h.div(
    [h.Class("min-w-0")],
    [
      h.p([h.Class("truncate text-sm text-text-primary")], [cell.primary]),
      ...(cell.secondary === undefined
        ? []
        : [h.p([h.Class("truncate text-sm text-text-tertiary")], [cell.secondary])]),
    ],
  );
};

const dotsIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("currentColor"), h.ViewBox("0 0 20 20")],
    [
      h.circle([h.Cx("10"), h.Cy("4"), h.R("1.5")]),
      h.circle([h.Cx("10"), h.Cy("10"), h.R("1.5")]),
      h.circle([h.Cx("10"), h.Cy("16"), h.R("1.5")]),
    ],
  );

const rowActions = <Message>(
  props: TableProps<Message>,
  rowId: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative")],
    [
      h.button(
        [
          h.AriaExpanded(props.openActionsFor === rowId),
          h.AriaHasPopup("menu"),
          h.AriaLabel("Row actions"),
          h.Class(
            "cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          ...(props.onActionMenuToggle === undefined
            ? []
            : [h.OnClick(props.onActionMenuToggle(rowId))]),
          h.Type("button"),
        ],
        [dotsIcon(h)],
      ),
      ...(props.openActionsFor === rowId
        ? [
            h.div(
              [
                h.Class(
                  "absolute top-10 right-0 z-10 w-36 rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary",
                ),
                h.Role("menu"),
              ],
              (["edit", "copy", "delete"] as const).map((action) =>
                h.button(
                  [
                    h.Class(
                      `flex w-full cursor-pointer rounded-md px-2.5 py-2 text-left text-sm font-medium outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 ${action === "delete" ? "text-text-error-primary" : "text-text-secondary"}`,
                    ),
                    ...(props.onAction === undefined
                      ? []
                      : [h.OnClick(props.onAction(rowId, action))]),
                    h.Role("menuitem"),
                    h.Type("button"),
                  ],
                  [({ copy: "Copy link", delete: "Delete", edit: "Edit" } as const)[action]],
                ),
              ),
            ),
          ]
        : []),
    ],
  );

export const table = <Message>(props: TableProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const isSelected = (id: string): boolean => props.selectedIds?.includes(id) === true;
  const allSelected =
    props.rows.at(0) !== undefined && props.rows.every((row) => isSelected(row.id));
  const someSelected = props.rows.some((row) => isSelected(row.id)) && !allSelected;
  return h.section(
    [h.Class("overflow-hidden rounded-xl bg-bg-primary shadow-xs ring-1 ring-border-secondary")],
    [
      ...(props.title === undefined
        ? []
        : [
            h.header(
              [
                h.Class(
                  `relative flex flex-col items-start gap-4 border-b border-border-secondary bg-bg-primary px-4 md:flex-row ${size === "sm" ? "py-4 md:px-5" : "py-5 md:px-6"}`,
                ),
              ],
              [
                h.div(
                  [h.Class("flex flex-1 flex-col gap-0.5")],
                  [
                    h.div(
                      [h.Class("flex items-center gap-2")],
                      [
                        h.h2([h.Class("text-md font-semibold text-text-primary")], [props.title]),
                        ...(props.badge === undefined
                          ? []
                          : [
                              h.span(
                                [
                                  h.Class(
                                    "rounded-md bg-utility-neutral-50 px-2 py-0.5 text-xs font-medium text-utility-neutral-700 ring-1 ring-inset ring-utility-neutral-200",
                                  ),
                                ],
                                [props.badge],
                              ),
                            ]),
                      ],
                    ),
                    ...(props.description === undefined
                      ? []
                      : [h.p([h.Class("text-sm text-text-tertiary")], [props.description])]),
                  ],
                ),
              ],
            ),
          ]),
      h.div(
        [h.Class("overflow-x-auto")],
        [
          h.table(
            [h.Class("w-full min-w-[720px] overflow-x-hidden"), h.Role("grid")],
            [
              h.thead(
                [h.Class(`relative bg-bg-secondary ${size === "sm" ? "h-9" : "h-11"}`)],
                [
                  h.tr(
                    [],
                    [
                      h.th(
                        [
                          h.Class(
                            `relative py-2 pr-0 pl-4 ${size === "sm" ? "w-9 md:pl-5" : "w-11 md:pl-6"}`,
                          ),
                        ],
                        [
                          checkbox(
                            "Select all rows",
                            allSelected,
                            props.onSelectAll?.(!allSelected),
                            h,
                            someSelected,
                          ),
                        ],
                      ),
                      ...props.columns.map((column, columnIndex) => {
                        const direction =
                          props.sort?.columnId === column.id ? props.sort.direction : undefined;
                        return h.keyed("th")(
                          `${column.id}-${direction ?? "none"}`,
                          [
                            ...(direction === undefined ? [] : [h.AriaSort(direction)]),
                            h.Class(
                              `relative py-2 pr-6 text-left ${columnIndex === 0 ? "pl-3" : "pl-6"} ${column.sortable === true ? "cursor-pointer" : ""}`,
                            ),
                          ],
                          [
                            h.button(
                              [
                                h.Class(
                                  "flex items-center gap-1 text-xs font-semibold whitespace-nowrap text-text-quaternary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                ),
                                ...(column.sortable !== true || props.onSort === undefined
                                  ? []
                                  : [
                                      h.OnClick(
                                        props.onSort(
                                          column.id,
                                          direction === "ascending" ? "descending" : "ascending",
                                        ),
                                      ),
                                    ]),
                                ...(column.tooltip === undefined ? [] : [h.Title(column.tooltip)]),
                                h.Type("button"),
                              ],
                              [
                                column.label,
                                ...(column.tooltip === undefined ? [] : [helpIcon(h)]),
                                ...(column.sortable === true ? [selectorIcon(direction, h)] : []),
                              ],
                            ),
                          ],
                        );
                      }),
                      h.th(
                        [h.Class("relative px-6 py-2")],
                        [h.span([h.Class("sr-only")], ["Actions"])],
                      ),
                    ],
                  ),
                ],
              ),
              h.tbody(
                [],
                props.rows.map((row) => {
                  const rowSelected = isSelected(row.id);
                  return h.keyed("tr")(
                    row.id,
                    [
                      h.Class(
                        `relative outline-focus-ring transition-colors after:pointer-events-none hover:bg-bg-secondary focus-within:outline-2 focus-within:-outline-offset-2 [&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden ${rowSelected ? "bg-bg-secondary" : ""} ${size === "sm" ? "h-14" : "h-18"}`,
                      ),
                    ],
                    [
                      h.td(
                        [
                          h.Class(
                            `relative py-2 pr-0 pl-4 ${size === "sm" ? "md:pl-5" : "md:pl-6"}`,
                          ),
                        ],
                        [
                          checkbox(
                            `Select row ${row.id}`,
                            rowSelected,
                            props.onSelectionChange?.(row.id, !rowSelected),
                            h,
                          ),
                        ],
                      ),
                      ...props.columns.map((column, columnIndex) =>
                        h.td(
                          [
                            h.Class(
                              `relative text-sm text-text-tertiary outline-focus-ring ${size === "sm" ? `py-3 pr-5 ${columnIndex === 0 ? "pl-3" : "pl-5"}` : `py-4 pr-6 ${columnIndex === 0 ? "pl-3" : "pl-6"}`}`,
                            ),
                          ],
                          row.cells[column.id] === undefined
                            ? []
                            : [renderCell(row.cells[column.id], h)],
                        ),
                      ),
                      h.td(
                        [h.Class(`relative ${size === "sm" ? "px-5 py-3" : "px-6 py-4"}`)],
                        [rowActions(props, row.id, h)],
                      ),
                    ],
                  );
                }),
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
