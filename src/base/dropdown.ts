/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, unicorn/no-nested-ternary -- The upstream compound menu needs explicit native keyboard and focus behavior. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type DropdownSelectionIndicator = "checkmark" | "checkbox" | "radio" | "toggle" | "none";

export interface DropdownItemSpec {
  readonly addon?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
  readonly selectionIndicator?: DropdownSelectionIndicator;
  readonly submenu?: boolean;
}

export interface DropdownProps<Message> {
  readonly focusedId: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly items: readonly DropdownItemSpec[];
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly selectedIds: readonly string[];
  readonly selectionIndicator?: DropdownSelectionIndicator;
  readonly trigger?: "button" | "dots";
  readonly triggerLabel?: string;
}

const triggerSelector = (id: string): string => `[data-dropdown-trigger="${id}"]`;
const itemSelector = (id: string, itemId: string): string =>
  `[data-dropdown-id="${id}"][data-dropdown-item="${itemId}"]`;

const dots = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 transition-inherit-all"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
        ),
      ]),
    ],
  );

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m9 18 6-6-6-6")])],
  );

const check = <Message>(visible: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-brand-primary ${visible ? "" : "invisible"}`,
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m20 6-11 11-5-5")])],
  );

const selectionControl = <Message>(
  indicator: DropdownSelectionIndicator,
  selected: boolean,
  h: HtmlBuilder<Message>,
): readonly Html[] => {
  if (indicator === "none") {
    return [];
  }
  if (indicator === "checkmark") {
    return [check(selected, h)];
  }
  if (indicator === "toggle") {
    return [
      h.span(
        [
          h.AriaHidden(true),
          h.Class(
            `mr-2 h-4 w-8 shrink-0 rounded-full ring-[0.5px] ring-border-secondary transition duration-150 ease-linear ring-inset ${selected ? "bg-bg-brand-solid" : "bg-bg-tertiary"}`,
          ),
        ],
        [
          h.span([
            h.Class(
              `block size-4 rounded-full border border-border-primary bg-fg-white shadow-xs transition-transform duration-150 ease-linear ${selected ? "translate-x-4" : ""}`,
            ),
          ]),
        ],
      ),
    ];
  }
  if (indicator === "checkbox") {
    return [
      h.span(
        [
          h.AriaHidden(true),
          h.Class(
            `relative mr-2 flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
          ),
        ],
        selected
          ? [
              h.svg(
                [
                  h.Class("pointer-events-none size-3.5 text-fg-white"),
                  h.Fill("none"),
                  h.ViewBox("0 0 14 14"),
                ],
                [
                  h.path([
                    h.D("M11.6666 3.5 5.24992 9.91667 2.33325 7"),
                    h.Stroke("currentColor"),
                    h.StrokeLinecap("round"),
                    h.StrokeLinejoin("round"),
                    h.StrokeWidth("2"),
                  ]),
                ],
              ),
            ]
          : [],
      ),
    ];
  }
  return [
    h.span(
      [
        h.AriaHidden(true),
        h.Class(
          `mr-2 flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
        ),
      ],
      [
        h.span([
          h.Class(`size-1.5 rounded-full bg-fg-white ${selected ? "opacity-100" : "opacity-0"}`),
        ]),
      ],
    ),
  ];
};

const move = <Message>(props: DropdownProps<Message>, currentId: string, key: string) => {
  const enabled = props.items.filter((item) => item.disabled !== true);
  const current = enabled.findIndex((item) => item.id === currentId);
  const target =
    key === "Home"
      ? enabled.at(0)
      : key === "End"
        ? enabled.at(-1)
        : key === "ArrowDown"
          ? enabled[(current + 1 + enabled.length) % enabled.length]
          : key === "ArrowUp"
            ? enabled[(current - 1 + enabled.length) % enabled.length]
            : undefined;
  return target === undefined
    ? Option.none()
    : Option.some({
        focusSelector: itemSelector(props.id, target.id),
        message: props.onFocus(target.id),
      });
};

const menuItem = <Message>(
  item: DropdownItemSpec,
  props: DropdownProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const indicator = item.selectionIndicator ?? props.selectionIndicator ?? "checkmark";
  const selected = props.selectedIds.includes(item.id);
  const control = selectionControl(indicator, selected, h);
  return h.button(
    [
      h.Class(
        `group block w-full px-1.5 py-px text-left outline-none ${item.disabled === true ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
      ),
      h.Type("button"),
      h.Role(indicator === "none" ? "menuitem" : "menuitemcheckbox"),
      h.Tabindex(item.id === props.focusedId ? 0 : -1),
      h.Autofocus(item.id === props.focusedId),
      h.Disabled(item.disabled === true),
      h.DataAttribute("dropdown-id", props.id),
      h.DataAttribute("dropdown-item", item.id),
      ...(indicator === "none" ? [] : [h.Attribute("aria-checked", String(selected))]),
      h.OnClick(props.onSelect(item.id), { focusSelector: triggerSelector(props.id) }),
      h.OnFocus(props.onFocus(item.id)),
      h.OnKeyDownFocus((key) => {
        if (key === "Escape") {
          return Option.some({ focusSelector: triggerSelector(props.id), message: props.onClose });
        }
        if (key === "Enter" || key === " ") {
          return Option.some({
            focusSelector: triggerSelector(props.id),
            message: props.onSelect(item.id),
          });
        }
        return move(props, item.id, key);
      }),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear ${item.disabled === true ? "" : "group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover"} ${item.id === props.focusedId ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
          ),
        ],
        [
          ...control,
          h.span(
            [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
            [item.label],
          ),
          ...(item.addon === undefined
            ? []
            : [
                h.span(
                  [h.Class("ml-1 shrink-0 pr-1 text-xs font-medium text-text-quaternary")],
                  [item.addon],
                ),
              ]),
          ...(item.submenu === true ? [chevronRight(h)] : []),
        ],
      ),
    ],
  );
};

export const dropdown = <Message>(props: DropdownProps<Message>, h: HtmlBuilder<Message>): Html => {
  const triggerLabel = props.triggerLabel ?? "Open menu";
  const anchor = `--dropdown-${props.id.replaceAll(/[^a-zA-Z0-9_-]/gu, "-")}`;
  return h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            props.trigger === "dots"
              ? `cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${props.isOpen ? "outline-2 outline-offset-2" : ""}`
              : "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
          ...(props.trigger === "dots" ? [h.AriaLabel(triggerLabel)] : []),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.DataAttribute("dropdown-trigger", props.id),
          h.OnClick(props.onToggle),
          h.Style({ "anchor-name": anchor }),
        ],
        props.trigger === "dots" ? [dots(h)] : [h.span([h.Class("px-0.5")], [triggerLabel])],
      ),
      ...(props.isOpen
        ? [
            h.div([h.AriaHidden(true), h.Class("fixed inset-0 z-10"), h.OnClick(props.onClose)]),
            h.div(
              [
                h.Class(
                  "fixed z-20 w-62 origin-top-right overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt",
                ),
                h.Style({
                  left: "max(0.75rem, calc(anchor(right) - 15.5rem))",
                  "position-anchor": anchor,
                  top: "calc(anchor(bottom) + 0.5rem)",
                }),
              ],
              [
                h.div(
                  [h.Class("h-min overflow-y-auto py-1 outline-none select-none"), h.Role("menu")],
                  props.items.map((item) => menuItem(item, props, h)),
                ),
              ],
            ),
          ]
        : []),
    ],
  );
};
