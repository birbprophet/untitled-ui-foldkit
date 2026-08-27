/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, typescript/prefer-for-of -- Untitled tab styles are a closed orientation, type, size, and state table with bounded roving focus. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";

export type TabType =
  | "button-brand"
  | "button-gray"
  | "button-border"
  | "button-minimal"
  | "underline"
  | "line";

export interface TabItem<Message> {
  readonly badge?: number | string;
  readonly content?: string;
  readonly focusMessage: NoInfer<Message>;
  readonly icon?: Html;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly selectMessage: NoInfer<Message>;
}

export interface TabsProps<Message> {
  readonly ariaLabel: string;
  readonly className?: string;
  readonly focusedId?: string;
  readonly fullWidth?: boolean;
  readonly id: string;
  readonly items: readonly TabItem<NoInfer<Message>>[];
  readonly orientation?: "horizontal" | "vertical";
  readonly selectedId: string;
  readonly size?: "sm" | "md";
  readonly type?: TabType;
}

const sizes = {
  md: {
    base: "gap-1.5 text-md font-semibold *:data-icon:size-5",
    button: "px-2.5 py-2.5",
    line: "py-1 pr-3.5 pl-3",
    underline: "px-0.5 pt-0 pb-2.5",
  },
  sm: {
    base: "gap-1 text-sm font-semibold *:data-icon:size-4",
    button: "px-2.5 py-2",
    line: "py-0.5 pr-3 pl-2.5",
    underline: "px-0.5 pt-0 pb-2.5",
  },
} as const;

const listClass = (
  type: TabType,
  size: "sm" | "md",
  orientation: "horizontal" | "vertical",
  fullWidth: boolean,
): string => {
  const horizontal =
    type === "button-border"
      ? `gap-1 rounded-[10px] bg-bg-secondary-alt p-1 ring-1 ring-border-secondary ring-inset ${size === "md" ? "rounded-xl p-1.5" : ""}`
      : type === "button-minimal"
        ? "gap-0.5 rounded-lg bg-bg-secondary-alt ring-1 ring-border-secondary ring-inset"
        : type === "underline"
          ? `relative gap-3 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border-secondary ${fullWidth ? "w-full gap-4" : ""}`
          : "gap-1";
  return `group flex ${horizontal} ${orientation === "vertical" ? "w-max flex-col" : ""}`;
};

const tabClass = (
  type: TabType,
  size: "sm" | "md",
  selected: boolean,
  fullWidth: boolean,
): string => {
  const typeSize =
    type === "underline"
      ? sizes[size].underline
      : type === "line"
        ? sizes[size].line
        : sizes[size].button;
  const anatomy =
    type === "underline"
      ? "rounded-none border-b-2 border-transparent"
      : type === "line"
        ? "rounded-none border-l-2 border-transparent"
        : type === "button-minimal"
          ? "rounded-lg"
          : "";
  const selectedClass = selected
    ? type === "button-brand"
      ? "bg-bg-brand-primary text-text-brand-secondary *:data-icon:text-fg-brand-primary"
      : type === "button-gray"
        ? "bg-bg-primary-hover text-text-secondary *:data-icon:text-fg-secondary-hover"
        : type === "button-border"
          ? "bg-bg-primary-alt text-text-secondary shadow-sm *:data-icon:text-fg-secondary-hover"
          : type === "button-minimal"
            ? "bg-bg-primary-alt text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset *:data-icon:text-fg-secondary-hover"
            : "border-fg-brand-primary text-text-brand-secondary *:data-icon:text-fg-brand-primary"
    : "";
  return `z-10 flex h-max cursor-pointer items-center justify-center gap-2 rounded-md whitespace-nowrap text-text-quaternary outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 group-orientation-vertical:justify-start ${sizes[size].base} ${typeSize} ${anatomy} ${selectedClass} ${fullWidth ? "w-full flex-1" : ""}`;
};

const selectorFor = (rootId: string, itemId: string): string =>
  `[data-tabs-id="${rootId}"][data-tab-id="${itemId}"]`;

const moveFocus = <Message>(
  props: TabsProps<Message>,
  index: number,
  key: string,
): Option.Option<Readonly<{ focusSelector: string; message: Message }>> => {
  const horizontal = (props.orientation ?? "horizontal") === "horizontal";
  const delta =
    key === (horizontal ? "ArrowRight" : "ArrowDown")
      ? 1
      : key === (horizontal ? "ArrowLeft" : "ArrowUp")
        ? -1
        : 0;
  if (delta === 0 || props.items.length === 0) {
    return Option.none();
  }
  let next = index;
  for (let steps = 0; steps < props.items.length; steps += 1) {
    next = (next + delta + props.items.length) % props.items.length;
    const candidate = props.items[next];
    if (candidate !== undefined && candidate.isDisabled !== true) {
      return Option.some({
        focusSelector: selectorFor(props.id, candidate.id),
        message: candidate.focusMessage,
      });
    }
  }
  return Option.none();
};

export const tabs = <Message>(props: TabsProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const type = props.type ?? "button-brand";
  const orientation = props.orientation ?? "horizontal";
  const fullWidth = props.fullWidth ?? false;
  const firstEnabled = props.items.find((item) => item.isDisabled !== true)?.id;
  const list = h.div(
    [
      h.AriaLabel(props.ariaLabel),
      h.Attribute("aria-orientation", orientation),
      h.Class(
        `${listClass(type, size, orientation, fullWidth)}${props.className === undefined ? "" : ` ${props.className}`}`,
      ),
      h.Role("tablist"),
    ],
    props.items.map((item, index) => {
      const selected = item.id === props.selectedId;
      const focused = item.id === (props.focusedId ?? props.selectedId ?? firstEnabled);
      const pillBadge = type === "underline" || type === "line" || type === "button-brand";
      const tabId = `${props.id}-tab-${item.id}`;
      const panelId = `${props.id}-panel-${item.id}`;
      return h.button(
        [
          h.AriaControls(panelId),
          h.AriaSelected(selected),
          h.Class(tabClass(type, size, selected, fullWidth)),
          h.DataAttribute("tab-id", item.id),
          h.DataAttribute("tabs-id", props.id),
          h.Disabled(item.isDisabled ?? false),
          h.Id(tabId),
          h.OnClick(item.selectMessage),
          h.OnFocus(item.focusMessage),
          h.OnKeyDownFocus((key) => moveFocus(props, index, key)),
          h.Role("tab"),
          h.Tabindex(focused ? 0 : -1),
          h.Type("button"),
        ],
        [
          ...(item.icon === undefined ? [] : [item.icon]),
          h.span(
            [h.Class(`flex items-center gap-1.5 ${type === "line" ? "" : "px-0.5"}`)],
            [
              item.label,
              ...(item.badge === undefined
                ? []
                : [
                    h.span(
                      [h.Class(`hidden md:flex ${size === "sm" ? "-my-px" : ""}`)],
                      [
                        badge(
                          {
                            color: pillBadge && selected ? "brand" : "gray",
                            label: String(item.badge),
                            size: "sm",
                            type: pillBadge ? "pill-color" : "modern",
                          },
                          h,
                        ),
                      ],
                    ),
                  ]),
            ],
          ),
        ],
      );
    }),
  );
  const selected = props.items.find((item) => item.id === props.selectedId);
  return h.div(
    [h.Class(`flex w-full ${orientation === "vertical" ? "flex-row" : "flex-col"}`)],
    [
      list,
      ...(selected?.content === undefined
        ? []
        : [
            h.div(
              [
                h.Attribute("aria-labelledby", `${props.id}-tab-${selected.id}`),
                h.Class(
                  "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                ),
                h.Id(`${props.id}-panel-${selected.id}`),
                h.Role("tabpanel"),
                h.Tabindex(0),
              ],
              [selected.content],
            ),
          ]),
    ],
  );
};
