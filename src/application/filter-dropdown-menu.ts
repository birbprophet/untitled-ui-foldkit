/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/complexity, mps/prefer-option-over-null -- The upstream compound is a closed set of trigger, dialog, row, and count-badge variants. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FilterDropdownRow<Message> {
  readonly content: readonly Html[];
  readonly field: string;
  readonly id: string;
  readonly onRemove?: NoInfer<Message>;
  readonly operator: string;
  readonly value: string;
}

interface FilterDialogActions<Message> {
  readonly onAddFilter?: NoInfer<Message>;
  readonly onApply?: NoInfer<Message>;
  readonly onClearAll?: NoInfer<Message>;
}

export interface FilterDropdownDialogProps<Message> extends FilterDialogActions<Message> {
  readonly filters: readonly FilterDropdownRow<Message>[];
  readonly kind: "dialog";
}

export interface FilterDropdownTriggerProps<Message> extends FilterDialogActions<Message> {
  readonly appliedCount?: number;
  readonly filters: readonly FilterDropdownRow<Message>[];
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly kind: "dropdown";
  readonly onOpenChanged: (open: boolean) => NoInfer<Message>;
  readonly placement?: "bottom" | "bottom start" | "bottom end";
  readonly triggerLabel?: string;
}

export interface FilterDropdownCountProps {
  readonly count: number;
  readonly kind: "count-badge";
}

export type FilterDropdownMenuProps<Message> =
  | FilterDropdownCountProps
  | FilterDropdownDialogProps<Message>
  | FilterDropdownTriggerProps<Message>;

const icon = <Message>(
  type: "chevron" | "close" | "filter" | "plus",
  h: HtmlBuilder<Message>,
): Html => {
  const path = {
    chevron: "m5.5 7.5 4.5 4.5 4.5-4.5",
    close: "m5 5 10 10M15 5 5 15",
    filter: "M3 5h14M5.5 10h9M8 15h4",
    plus: "M10 4v12M4 10h12",
  }[type];
  return h.svg(
    [h.AriaHidden(true), h.Class("size-4 shrink-0"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );
};

const countBadge = <Message>(count: number, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        "inline-flex items-center rounded-md border border-border-primary bg-bg-primary px-1.5 py-0.5 text-xs leading-[18px] font-medium text-text-secondary shadow-xs",
      ),
    ],
    [String(count)],
  );

const actionButton = <Message>(
  label: string,
  color: "primary" | "secondary",
  message: Message | undefined,
  leadingPlus: boolean,
  h: HtmlBuilder<Message>,
  popoverId?: string,
): Html =>
  h.button(
    [
      h.Class(
        `group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold whitespace-nowrap outline-focus-ring transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 ${color === "primary" ? "bg-bg-brand-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset hover:bg-bg-brand-solid-hover" : "bg-bg-primary text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset hover:bg-bg-primary-hover"}`,
      ),
      h.Type("button"),
      ...(message === undefined ? [] : [h.OnClick(message)]),
      ...(popoverId === undefined
        ? []
        : [h.Popovertarget(popoverId), h.Popovertargetaction("hide")]),
    ],
    [
      ...(leadingPlus ? [icon("plus", h)] : []),
      h.span([h.Class("px-0.5"), h.DataAttribute("text", "")], [label]),
    ],
  );

const filterDialog = <Message>(
  props: FilterDialogActions<Message> & {
    readonly filters: readonly FilterDropdownRow<Message>[];
  },
  h: HtmlBuilder<Message>,
  popoverId?: string,
): Html => {
  const hasFilters = props.filters[0] !== undefined;
  return h.div(
    [
      h.Class(
        "overflow-hidden rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt outline-hidden",
      ),
      h.Role("dialog"),
      h.AriaLabel("Filters"),
    ],
    hasFilters
      ? [
          h.div(
            [h.Class("flex flex-col gap-3 p-4")],
            [
              h.div(
                [h.Class("flex flex-col gap-3")],
                props.filters.map((filter) =>
                  h.keyed("div")(
                    filter.id,
                    [h.Class("flex items-start gap-1"), h.DataAttribute("filter-id", filter.id)],
                    [
                      h.div([h.Class("flex min-w-0 flex-1 items-center gap-3")], filter.content),
                      h.button(
                        [
                          h.AriaLabel("Remove filter"),
                          h.Class(
                            "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Type("button"),
                          ...(filter.onRemove === undefined ? [] : [h.OnClick(filter.onRemove)]),
                        ],
                        [icon("close", h)],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                "flex items-center justify-between border-t border-border-secondary px-4 py-3",
              ),
            ],
            [
              actionButton("Add filter", "secondary", props.onAddFilter, true, h),
              h.div(
                [h.Class("flex items-center gap-3")],
                [
                  actionButton("Clear all", "secondary", props.onClearAll, false, h),
                  actionButton("Apply filter", "primary", props.onApply, false, h, popoverId),
                ],
              ),
            ],
          ),
        ]
      : [
          h.div(
            [h.Class("flex flex-col gap-3 p-4")],
            [
              h.div(
                [h.Class("flex max-w-[352px] flex-col gap-1 text-sm")],
                [
                  h.p([h.Class("font-semibold text-text-primary")], ["No filters applied"]),
                  h.p(
                    [h.Class("font-normal text-text-tertiary")],
                    ["Add filters to narrow down results."],
                  ),
                ],
              ),
              h.div([], [actionButton("Add filter", "secondary", props.onAddFilter, true, h)]),
            ],
          ),
        ],
  );
};

export const filterDropdownMenu = <Message>(
  props: FilterDropdownMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (props.kind === "count-badge") {
    return countBadge(props.count, h);
  }
  if (props.kind === "dialog") {
    return filterDialog(props, h);
  }
  const popoverId = `${props.id}-popover`;
  const anchor = `--${props.id}`;
  const appliedCount = props.appliedCount ?? 0;
  const hasApplied = appliedCount > 0;
  const positionArea = {
    bottom: "bottom center",
    "bottom end": "bottom span-left",
    "bottom start": "bottom span-right",
  }[props.placement ?? "bottom end"];
  return h.div(
    [],
    [
      h.button(
        [
          h.AriaControls(popoverId),
          h.AriaHasPopup("dialog"),
          h.Class(
            `group relative inline-flex max-h-9 cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasApplied ? "bg-bg-primary-hover" : ""}`,
          ),
          h.Disabled(props.isDisabled === true),
          h.Popovertarget(popoverId),
          h.Style({ "anchor-name": anchor }),
          h.Type("button"),
        ],
        [
          icon("filter", h),
          h.span(
            [h.Class("flex items-center gap-1.5 px-0.5")],
            [props.triggerLabel ?? "Filters", ...(hasApplied ? [countBadge(appliedCount, h)] : [])],
          ),
          icon("chevron", h),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.filters[0] === undefined ? "w-[280px]" : "w-[624px]"} m-0 border-0 bg-transparent p-0 backdrop:bg-transparent`,
          ),
          h.Id(popoverId),
          h.OnToggle(props.onOpenChanged),
          h.Popover("auto"),
          h.Style({ "position-anchor": anchor, "position-area": positionArea }),
        ],
        [filterDialog(props, h, popoverId)],
      ),
    ],
  );
};
