/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, typescript/prefer-for-of -- Bounded roving focus follows disabled items in DOM order. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface TagItem<Message> {
  readonly avatarSeed?: string;
  readonly count?: number;
  readonly dot?: boolean;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly isSelected?: boolean;
  readonly label: string;
  readonly onFocus: NoInfer<Message>;
  readonly onRemove?: NoInfer<Message>;
  readonly onSelect?: NoInfer<Message>;
}

export interface TagsProps<Message> {
  readonly ariaLabel: string;
  readonly focusedId?: string;
  readonly items: readonly TagItem<Message>[];
  readonly selectionMode?: "none" | "single" | "multiple";
  readonly size?: "sm" | "md" | "lg";
}

const removeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-3 stroke-[3px]"), h.Fill("none"), h.ViewBox("0 0 12 12")],
    [
      h.path([
        h.D("m3 3 6 6m0-6L3 9"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.5"),
      ]),
    ],
  );

const tagSize: Record<
  "sm" | "md" | "lg",
  {
    readonly checkbox: string;
    readonly content: string;
    readonly count: string;
    readonly root: string;
  }
> = {
  lg: {
    checkbox: "size-4.5",
    content: "gap-1.5",
    count: "px-1.5 text-sm",
    root: "px-2.5 py-1 text-sm",
  },
  md: {
    checkbox: "size-4",
    content: "gap-1.25",
    count: "px-1.25 text-xs",
    root: "px-2.25 py-0.5 text-sm",
  },
  sm: {
    checkbox: "size-3.5",
    content: "gap-1",
    count: "px-1 text-xs",
    root: "px-2 py-0.75 text-xs",
  },
};

const selectionMark = <Message>(
  selected: boolean,
  disabled: boolean,
  size: "sm" | "md" | "lg",
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [
      h.Class(
        `relative flex shrink-0 items-center justify-center rounded ring-1 ring-inset ${tagSize[size].checkbox} ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"} ${disabled ? "opacity-50" : ""}`,
      ),
    ],
    selected
      ? [
          h.svg(
            [
              h.AriaHidden(true),
              h.Class(size === "sm" ? "size-2.5" : size === "md" ? "size-3" : "size-3.5"),
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
  );

const selectorFor = (id: string): string => `[data-tag-id="${id}"]`;

const navigate = <Message>(props: TagsProps<Message>, index: number, key: string) => {
  const delta =
    key === "ArrowRight" || key === "ArrowDown"
      ? 1
      : key === "ArrowLeft" || key === "ArrowUp"
        ? -1
        : 0;
  if (delta === 0 || props.items.length === 0) {
    return Option.none();
  }
  let nextIndex = index;
  for (let steps = 0; steps < props.items.length; steps += 1) {
    nextIndex = (nextIndex + delta + props.items.length) % props.items.length;
    const candidate = props.items[nextIndex];
    if (candidate !== undefined && candidate.isDisabled !== true) {
      return Option.some({ focusSelector: selectorFor(candidate.id), message: candidate.onFocus });
    }
  }
  return Option.none();
};

const tagAdornment = <Message>(
  item: TagItem<Message>,
  h: HtmlBuilder<Message>,
): readonly Html[] => {
  if (item.avatarSeed !== undefined) {
    return [
      h.img([
        h.Class("size-4 rounded-full"),
        h.Src(
          blobatarDataUri(item.avatarSeed, {
            background: "circle",
            kind: "agent",
            size: 32,
            title: item.label,
          }),
        ),
        h.Alt(""),
      ]),
    ];
  }
  if (item.dot === true) {
    return [
      h.svg(
        [h.AriaHidden(true), h.Class("size-2 text-utility-green-500"), h.ViewBox("0 0 8 8")],
        [
          h.circle([
            h.Cx("4"),
            h.Cy("4"),
            h.R("2.5"),
            h.Fill("currentColor"),
            h.Stroke("currentColor"),
          ]),
        ],
      ),
    ];
  }
  return [];
};

export const tags = <Message>(props: TagsProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const mode = props.selectionMode ?? "none";
  const firstEnabled = props.items.find((item) => item.isDisabled !== true)?.id;
  return h.div(
    [
      h.Class("flex flex-col items-stretch"),
      h.Role("listbox"),
      h.AriaLabel(props.ariaLabel),
      h.AriaMultiSelectable(mode === "multiple"),
    ],
    props.items.map((item, index) => {
      const focused = item.id === (props.focusedId ?? firstEnabled);
      const disabled = item.isDisabled === true;
      const selected = item.isSelected === true;
      const selectMessage = item.onSelect;
      const removeMessage = item.onRemove;
      const leftPadding =
        mode === "none"
          ? item.avatarSeed === undefined
            ? item.dot === true
              ? size === "sm"
                ? "pl-1.5"
                : size === "md"
                  ? "pl-1.75"
                  : "pl-2.25"
              : ""
            : size === "sm"
              ? "pl-1"
              : size === "md"
                ? "pl-1.25"
                : "pl-1.75"
          : size === "md"
            ? "pl-1"
            : "pl-1.25";
      const rightPadding =
        removeMessage !== undefined || item.count !== undefined
          ? item.count !== undefined && size === "md"
            ? "pr-0.75"
            : "pr-1"
          : "";
      const rootPadding = `${tagSize[size].root} ${leftPadding} ${rightPadding}`;
      return h.span(
        [
          h.Class(
            `inline-flex cursor-default items-center gap-0.75 rounded-md bg-bg-primary font-medium text-text-secondary ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-50 ease-linear ${rootPadding} ${disabled ? "opacity-50" : ""}`,
          ),
        ],
        [
          h.button(
            [
              h.Class(
                `inline-flex min-w-0 items-center ${tagSize[size].content} rounded outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2`,
              ),
              h.Type("button"),
              h.Role("option"),
              h.AriaSelected(selected),
              h.AriaDisabled(disabled),
              h.Tabindex(focused ? 0 : -1),
              h.DataAttribute("tag-id", item.id),
              ...(selectMessage === undefined || disabled || mode === "none"
                ? []
                : [h.OnClick(selectMessage)]),
              h.OnKeyDownFocus((key) => navigate(props, index, key)),
            ],
            [
              ...(mode === "none" ? [] : [selectionMark(selected, disabled, size, h)]),
              ...tagAdornment(item, h),
              h.span([h.Class("truncate")], [item.label]),
              ...(item.count === undefined
                ? []
                : [
                    h.span(
                      [
                        h.Class(
                          `flex items-center justify-center rounded-[3px] bg-bg-tertiary text-center font-medium ${tagSize[size].count}`,
                        ),
                      ],
                      [String(item.count)],
                    ),
                  ]),
            ],
          ),
          ...(removeMessage === undefined
            ? []
            : [
                h.button(
                  [
                    h.Class(
                      `flex rounded-[3px] text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-primary focus-visible:outline-2 ${size === "lg" ? "p-0.75" : "p-0.5"}`,
                    ),
                    h.Type("button"),
                    h.AriaLabel(`Remove ${item.label}`),
                    h.Disabled(disabled),
                    ...(disabled ? [] : [h.OnClick(removeMessage)]),
                  ],
                  [removeIcon(h)],
                ),
              ]),
        ],
      );
    }),
  );
};
