/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, typescript/prefer-for-of -- Controlled filtering and roving focus preserve the upstream combobox anatomy in one renderer. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxItem<Message> {
  readonly avatarSeed?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly onFocus: NoInfer<Message>;
  readonly onSelect: NoInfer<Message>;
  readonly supportingText?: string;
}

export interface ComboboxProps<Message> {
  readonly ariaLabel?: string;
  readonly focusedId?: string;
  readonly hint?: string;
  readonly inputValue: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isOpen: boolean;
  readonly isRequired?: boolean;
  readonly items: readonly ComboboxItem<Message>[];
  readonly label?: string;
  readonly name: string;
  readonly onClose: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly placeholder?: string;
  readonly selectedId?: string;
  readonly shortcut?: boolean;
  readonly size?: ComboboxSize;
}

const search = <Message>(size: ComboboxSize, h: HtmlBuilder<Message>): Html =>
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

const check = <Message>(size: ComboboxSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `${size === "sm" ? "size-4 stroke-[2.25px]" : "size-5"} ml-auto shrink-0 text-fg-brand-primary`,
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M20 6 9 17l-5-5")])],
  );

const avatar = <Message>(
  item: ComboboxItem<Message>,
  size: ComboboxSize,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [
      h.Class(
        `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-tertiary outline-[0.5px] -outline-offset-[0.5px] outline-black/16 ${size === "sm" ? "size-5" : "size-6"}`,
      ),
    ],
    [
      h.img([
        h.Alt(""),
        h.Class("size-full object-cover"),
        h.Src(
          blobatarDataUri(item.avatarSeed ?? item.id, {
            background: "circle",
            kind: "agent",
            size: 48,
            title: item.label,
          }),
        ),
      ]),
    ],
  );

const selectorFor = (name: string, id: string): string =>
  `[data-combobox="${name}"][data-combobox-item="${id}"]`;

const moveFocus = <Message>(
  items: readonly ComboboxItem<Message>[],
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

export const combobox = <Message>(props: ComboboxProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const listboxId = `combobox-${props.name}-listbox`;
  const selected = props.items.find((item) => item.id === props.selectedId);
  const normalizedFilter = props.inputValue.trim().toLocaleLowerCase();
  const available = props.items.filter(
    (item) =>
      normalizedFilter === "" ||
      `${item.label} ${item.supportingText ?? ""}`.toLocaleLowerCase().includes(normalizedFilter),
  );
  const focusedIndex = Math.max(
    0,
    available.findIndex((item) => item.id === props.focusedId),
  );
  const sizeClasses: Record<ComboboxSize, string> = {
    lg: "gap-2 px-3.5 py-2.5 text-md",
    md: "gap-2 px-3 py-2 text-md",
    sm: "gap-2 py-2 pr-2.5 pl-3 text-sm",
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
                h.For(`combobox-${props.name}`),
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
            `relative flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand ${props.isDisabled === true ? "cursor-not-allowed opacity-50" : ""} ${sizeClasses[size]}`,
          ),
        ],
        [
          search(size, h),
          h.div(
            [h.Class("relative flex w-full items-center")],
            [
              ...(selected === undefined || props.inputValue !== ""
                ? []
                : [
                    h.span(
                      [
                        h.Class(
                          "absolute top-1/2 z-0 inline-flex w-full -translate-y-1/2 gap-x-1.5 truncate",
                        ),
                        h.AriaHidden(true),
                      ],
                      [
                        h.span(
                          [
                            h.Class(
                              `${size === "sm" ? "text-sm" : "text-md"} font-medium text-text-primary`,
                            ),
                          ],
                          [selected.label],
                        ),
                        ...(selected.supportingText === undefined
                          ? []
                          : [
                              h.span(
                                [
                                  h.Class(
                                    `${size === "sm" ? "text-sm" : "text-md"} -ml-0.75 text-text-tertiary`,
                                  ),
                                ],
                                [selected.supportingText],
                              ),
                            ]),
                      ],
                    ),
                  ]),
              h.input([
                h.Class(
                  `${size === "sm" ? "text-sm" : "text-md"} z-10 w-full appearance-none bg-transparent text-transparent outline-none caret-fg-primary placeholder:text-text-placeholder disabled:cursor-not-allowed`,
                ),
                h.Id(`combobox-${props.name}`),
                h.Type("text"),
                h.Value(props.inputValue),
                h.Placeholder(selected === undefined ? (props.placeholder ?? "Search") : ""),
                h.Disabled(props.isDisabled === true),
                h.Role("combobox"),
                ...(props.ariaLabel === undefined ? [] : [h.AriaLabel(props.ariaLabel)]),
                h.AriaExpanded(props.isOpen),
                h.AriaControls(listboxId),
                h.AriaAutocomplete("list"),
                h.AriaInvalid(props.isInvalid === true),
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
            ],
          ),
          ...(props.shortcut === false
            ? []
            : [
                h.span(
                  [
                    h.Class(
                      `absolute inset-y-0.5 right-0.5 z-10 flex items-center bg-linear-to-r from-transparent to-bg-primary to-40% pl-8 ${size === "lg" ? "pr-3" : "pr-2.5"}`,
                    ),
                    h.AriaHidden(true),
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
              ]),
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
        ],
        available.map((item, index) => {
          const isSelected = item.id === props.selectedId;
          return h.button(
            [
              h.Class(
                `flex w-full items-center rounded-md py-px outline-focus-ring ${size === "sm" ? "px-1" : "px-1.5"}`,
              ),
              h.Type("button"),
              h.Role("option"),
              h.AriaSelected(isSelected),
              h.Disabled(item.isDisabled === true),
              h.Tabindex(index === focusedIndex ? 0 : -1),
              h.DataAttribute("combobox", props.name),
              h.DataAttribute("combobox-item", item.id),
              h.OnClick(item.onSelect),
              h.OnKeyDownFocus((key) => moveFocus(available, props.name, index, key)),
              h.OnKeyDownPreventDefault((key) =>
                key === "Escape" ? Option.some(props.onClose) : Option.none(),
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    `flex w-full cursor-pointer items-center rounded-md outline-none select-none ${size === "lg" ? "gap-2 p-2.5 pl-2" : "gap-2 p-2 pr-2.5"} ${isSelected ? "bg-bg-primary-hover" : ""} ${item.isDisabled === true ? "cursor-not-allowed opacity-50" : "hover:bg-bg-primary-hover"}`,
                  ),
                ],
                [
                  ...(item.avatarSeed === undefined ? [] : [avatar(item, size, h)]),
                  h.span(
                    [
                      h.Class(
                        `flex w-full min-w-0 flex-1 flex-wrap ${size === "sm" ? "gap-x-1.5" : "gap-x-2"}`,
                      ),
                    ],
                    [
                      h.span(
                        [
                          h.Class(
                            `${size === "sm" ? "text-sm" : "text-md"} truncate font-medium whitespace-nowrap text-text-primary`,
                          ),
                        ],
                        [item.label],
                      ),
                      ...(item.supportingText === undefined
                        ? []
                        : [
                            h.span(
                              [
                                h.Class(
                                  `${size === "sm" ? "text-sm" : "text-md"} whitespace-nowrap text-text-tertiary`,
                                ),
                              ],
                              [item.supportingText],
                            ),
                          ]),
                    ],
                  ),
                  ...(isSelected ? [check(size, h)] : []),
                ],
              ),
            ],
          );
        }),
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
