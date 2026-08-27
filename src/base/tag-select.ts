/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, typescript/prefer-for-of -- Controlled collection rendering keeps upstream tag and listbox anatomy together. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type TagSelectSize = "sm" | "md" | "lg";

export interface TagSelectItem<Message> {
  readonly avatarUrl?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly onFocus: NoInfer<Message>;
  readonly onRemove: NoInfer<Message>;
  readonly onSelect: NoInfer<Message>;
  readonly supportingText?: string;
}

export interface TagSelectProps<Message> {
  readonly ariaLabel?: string;
  readonly focusedId?: string;
  readonly hint?: string;
  readonly inputValue: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isOpen: boolean;
  readonly isRequired?: boolean;
  readonly items: readonly TagSelectItem<Message>[];
  readonly label?: string;
  readonly name: string;
  readonly onClose: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly placeholder?: string;
  readonly selectedIds: readonly string[];
  readonly showSearchIcon?: boolean;
  readonly useSupportingTextOnMobile?: boolean;
  readonly shortcut?: boolean;
  readonly size?: TagSelectSize;
}

const search = <Message>(size: TagSelectSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `pointer-events-none shrink-0 text-fg-quaternary ${size === "sm" ? "size-4" : "size-5"}`,
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z")])],
  );

const closeIcon = <Message>(size: TagSelectSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(size === "sm" ? "size-2.5" : "size-3"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(size === "sm" ? "3.6" : "2.86"),
      ]),
    ],
  );

const selectorFor = (name: string, id: string): string =>
  `[data-tag-select="${name}"][data-tag-select-item="${id}"]`;

const moveFocus = <Message>(
  items: readonly TagSelectItem<Message>[],
  name: string,
  index: number,
  key: string,
) => {
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (delta === 0 || items.length === 0) {
    return Option.none();
  }
  let next = index;
  for (let steps = 0; steps < items.length; steps += 1) {
    next = (next + delta + items.length) % items.length;
    const candidate = items[next];
    if (candidate !== undefined && candidate.isDisabled !== true) {
      return Option.some({
        focusSelector: selectorFor(name, candidate.id),
        message: candidate.onFocus,
      });
    }
  }
  return Option.none();
};

const avatar = <Message>(src: string, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        "relative inline-flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-tertiary outline-[0.5px] -outline-offset-[0.5px] outline-black/16",
      ),
    ],
    [h.img([h.Alt(""), h.Class("size-full object-cover"), h.Src(src)])],
  );

export const tagSelect = <Message>(
  props: TagSelectProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  const listboxId = `tag-select-${props.name}-listbox`;
  const selected = props.items.filter((item) => props.selectedIds.includes(item.id));
  const normalizedFilter = props.inputValue.trim().toLocaleLowerCase();
  const available = props.items.filter(
    (item) =>
      !props.selectedIds.includes(item.id) &&
      (normalizedFilter === "" ||
        `${item.label} ${item.supportingText ?? ""}`
          .toLocaleLowerCase()
          .includes(normalizedFilter)),
  );
  const focusedIndex = Math.max(
    0,
    available.findIndex((item) => item.id === props.focusedId),
  );
  const sizeClasses: Record<TagSelectSize, string> = {
    lg: "gap-2 px-3.5 py-2.5 text-md",
    md: "gap-2 px-3 py-2 text-md",
    sm: `gap-2 pr-2.5 pl-3 ${selected.length > 0 ? "py-1.5" : "py-2"} text-sm`,
  };
  return h.div(
    [h.Class("relative flex w-full flex-col gap-1.5")],
    [
      ...(props.label === undefined
        ? []
        : [
            h.label(
              [
                h.Class(
                  "flex cursor-default items-center gap-0.5 text-sm font-medium text-text-secondary",
                ),
                h.For(`tag-select-${props.name}`),
              ],
              [
                props.label,
                ...(props.isRequired === true
                  ? [h.span([h.Class("text-text-brand-tertiary")], ["*"])]
                  : []),
              ],
            ),
          ]),
      h.div(
        [
          h.Class(
            `relative flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand ${props.isDisabled === true ? "cursor-not-allowed opacity-50" : ""} ${sizeClasses[size]}`,
          ),
        ],
        [
          ...(props.showSearchIcon === false ? [] : [search(size, h)]),
          h.div(
            [
              h.Class(
                "relative flex w-full min-w-0 flex-1 flex-row flex-wrap items-center justify-start gap-1.5",
              ),
            ],
            [
              ...selected.map((item) =>
                h.span(
                  [
                    h.Class(
                      `flex min-w-0 items-center rounded-md bg-bg-primary ring-1 ring-border-primary ring-inset ${size === "sm" ? "px-1 py-0.75" : "py-0.5 pr-1 pl-1.25"}`,
                    ),
                  ],
                  [
                    ...(item.avatarUrl === undefined ? [] : [avatar(item.avatarUrl, h)]),
                    ...(props.useSupportingTextOnMobile === true
                      ? [
                          h.span(
                            [
                              h.Class(
                                `truncate font-medium whitespace-nowrap text-text-secondary select-none sm:hidden ${size === "sm" ? "ml-1 text-xs" : "ml-1.25 text-sm"}`,
                              ),
                            ],
                            [item.supportingText ?? item.label],
                          ),
                          h.span(
                            [
                              h.Class(
                                `hidden truncate font-medium whitespace-nowrap text-text-secondary select-none sm:inline ${size === "sm" ? "ml-1 text-xs" : "ml-1.25 text-sm"}`,
                              ),
                            ],
                            [item.label],
                          ),
                        ]
                      : [
                          h.span(
                            [
                              h.Class(
                                `truncate font-medium whitespace-nowrap text-text-secondary select-none ${size === "sm" ? "ml-1 text-xs" : "ml-1.25 text-sm"}`,
                              ),
                            ],
                            [item.label],
                          ),
                        ]),
                    h.button(
                      [
                        h.Class(
                          "ml-0.75 flex cursor-pointer rounded-[3px] p-0.5 text-fg-quaternary outline-transparent transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed",
                        ),
                        h.Type("button"),
                        h.AriaLabel(`Remove ${item.label}`),
                        h.Disabled(props.isDisabled === true),
                        h.OnClick(item.onRemove),
                      ],
                      [closeIcon(size, h)],
                    ),
                  ],
                ),
              ),
              h.div(
                [
                  h.Class(
                    `relative flex min-w-12 flex-1 items-center ${selected.length > 0 ? "ml-0.5" : ""} ${props.shortcut === true ? "min-w-[30%]" : ""}`,
                  ),
                ],
                [
                  h.input([
                    h.Class(
                      "w-full flex-[1_0_0] appearance-none bg-transparent text-ellipsis text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed",
                    ),
                    h.Id(`tag-select-${props.name}`),
                    h.Type("text"),
                    h.Value(props.inputValue),
                    h.Placeholder(props.placeholder ?? "Search"),
                    h.Disabled(props.isDisabled === true),
                    h.Role("combobox"),
                    ...(props.ariaLabel === undefined ? [] : [h.AriaLabel(props.ariaLabel)]),
                    h.AriaExpanded(props.isOpen),
                    h.AriaControls(listboxId),
                    h.AriaAutocomplete("list"),
                    h.OnInput(props.onInput),
                    h.OnFocus(props.onOpen),
                    h.OnKeyDownFocus((key) =>
                      key === "ArrowDown" && available[0] !== undefined
                        ? Option.some({
                            focusSelector: selectorFor(props.name, available[0].id),
                            message: available[0].onFocus,
                          })
                        : Option.none(),
                    ),
                    h.OnKeyDownPreventDefault((key) =>
                      key === "Escape" ? Option.some(props.onClose) : Option.none(),
                    ),
                  ]),
                  ...(props.shortcut === true
                    ? [
                        h.span(
                          [
                            h.Class(
                              `absolute inset-y-0.5 right-0.5 z-10 flex items-center bg-linear-to-r from-transparent to-bg-primary to-40% pl-8 ${size === "lg" ? "pr-3" : "pr-2.5"}`,
                            ),
                            h.AriaHidden(true),
                          ],
                          [
                            h.kbd(
                              [
                                h.Class(
                                  "pointer-events-none rounded px-1 py-px font-sans text-xs font-medium text-text-quaternary ring-1 ring-border-secondary ring-inset select-none",
                                ),
                              ],
                              ["⌘K"],
                            ),
                          ],
                        ),
                      ]
                    : []),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Id(listboxId),
          h.Role("listbox"),
          h.AriaLabel(props.ariaLabel ?? props.label ?? props.name),
          h.AriaMultiSelectable(true),
        ],
        available.map((item, index) =>
          h.button(
            [
              h.Class(
                `flex w-full items-center gap-2 rounded-md p-2 text-left text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:bg-bg-primary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 ${item.isDisabled === true ? "opacity-50" : ""}`,
              ),
              h.Type("button"),
              h.Role("option"),
              h.AriaSelected(false),
              h.Disabled(item.isDisabled === true),
              h.Tabindex(index === focusedIndex ? 0 : -1),
              h.DataAttribute("tag-select", props.name),
              h.DataAttribute("tag-select-item", item.id),
              h.OnClick(item.onSelect),
              h.OnKeyDownFocus((key) => moveFocus(available, props.name, index, key)),
              h.OnKeyDownPreventDefault((key) =>
                key === "Escape" ? Option.some(props.onClose) : Option.none(),
              ),
            ],
            [
              ...(item.avatarUrl === undefined ? [] : [avatar(item.avatarUrl, h)]),
              h.span([h.Class("truncate font-medium text-text-primary")], [item.label]),
              ...(item.supportingText === undefined
                ? []
                : [h.span([h.Class("text-text-tertiary")], [item.supportingText])]),
            ],
          ),
        ),
      ),
      ...(props.hint === undefined
        ? []
        : [
            h.span(
              [
                h.Class(
                  `${size === "sm" ? "text-xs" : "text-sm"} ${props.isInvalid === true ? "text-text-error-primary" : "text-text-tertiary"}`,
                ),
                ...(props.isInvalid === true ? [h.Role("alert")] : []),
              ],
              [props.hint],
            ),
          ]),
    ],
  );
};
