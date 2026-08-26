/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, mps/no-length-comparison, mps/prefer-arr-match, typescript/prefer-for-of -- Native popover selection uses bounded DOM-order roving focus. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface SelectItem<Message> {
  readonly avatarSeed?: string;
  readonly id: string;
  readonly iconElement?: Html;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly onFocus: NoInfer<Message>;
  readonly onSelect: NoInfer<Message>;
  readonly supportingText?: string;
}

export interface SelectProps<Message> {
  readonly hint?: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isRequired?: boolean;
  readonly items: readonly SelectItem<Message>[];
  readonly label?: string;
  readonly name: string;
  readonly onOpenChanged: (open: boolean) => NoInfer<Message>;
  readonly placeholder?: string;
  readonly selectedId?: string;
  readonly size?: "sm" | "md" | "lg";
}

const chevron = <Message>(size: "sm" | "md" | "lg", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(`${size === "lg" ? "size-5" : "size-4"} shrink-0 text-fg-quaternary`),
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
  );

const check = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 text-fg-brand-primary"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D("m4.5 10 3.5 3.5 7.5-7.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const selectorFor = (selectId: string, itemId: string): string =>
  `[data-select="${selectId}"][data-select-item="${itemId}"]`;

const moveFocus = <Message>(
  props: SelectProps<Message>,
  selectId: string,
  index: number,
  key: string,
) => {
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (delta === 0 || props.items.length === 0) {
    return Option.none();
  }
  let nextIndex = index;
  for (let steps = 0; steps < props.items.length; steps += 1) {
    nextIndex = (nextIndex + delta + props.items.length) % props.items.length;
    const candidate = props.items[nextIndex];
    if (candidate !== undefined && candidate.isDisabled !== true) {
      return Option.some({
        focusSelector: selectorFor(selectId, candidate.id),
        message: candidate.onFocus,
      });
    }
  }
  return Option.none();
};

const itemCopy = <Message>(
  item: SelectItem<Message>,
  size: "sm" | "md" | "lg",
  h: HtmlBuilder<Message>,
): readonly Html[] => [
  ...(item.iconElement === undefined ? [] : [item.iconElement]),
  ...(item.iconElement !== undefined || item.avatarSeed === undefined
    ? []
    : [
        h.img([
          h.Alt(""),
          h.Class(`${size === "sm" ? "size-5" : "size-6"} rounded-full`),
          h.Src(
            blobatarDataUri(item.avatarSeed, {
              background: "circle",
              kind: "agent",
              size: 48,
              title: item.label,
            }),
          ),
        ]),
      ]),
  h.span(
    [h.Class("flex w-full min-w-0 flex-1 flex-wrap gap-x-1.5 text-left")],
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
];

export const select = <Message>(props: SelectProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const selectId = `select-${props.name.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`;
  const popoverId = `${selectId}-popover`;
  const selected = props.items.find((item) => item.id === props.selectedId);
  const firstEnabled = props.items.find((item) => item.isDisabled !== true)?.id;
  const activeId = selected?.id ?? firstEnabled;
  const sizeClass =
    size === "lg"
      ? "px-3.5 py-2.5 text-md"
      : size === "md"
        ? "gap-2 px-3 py-2 text-md"
        : "gap-2 py-2 pr-2.5 pl-3 text-sm";
  return h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      ...(props.label === undefined
        ? []
        : [
            h.label(
              [h.Class("text-sm font-medium text-text-secondary"), h.For(selectId)],
              [props.label, ...(props.isRequired === true ? [" *"] : [])],
            ),
          ]),
      h.button(
        [
          h.Class(
            `flex w-full items-center gap-2 rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-bg-disabled-subtle disabled:opacity-50 ${sizeClass} ${props.isInvalid === true ? "ring-border-error-subtle" : ""}`,
          ),
          h.Id(selectId),
          h.Type("button"),
          h.Disabled(props.isDisabled === true),
          h.AriaHasPopup("listbox"),
          h.AriaControls(popoverId),
          h.AriaInvalid(props.isInvalid === true),
          h.Popovertarget(popoverId),
          h.Style({ "anchor-name": `--${selectId}` }),
        ],
        [
          ...(selected === undefined
            ? [
                h.span(
                  [h.Class("flex-1 truncate text-left text-text-placeholder")],
                  [props.placeholder ?? "Select an option"],
                ),
              ]
            : itemCopy(selected, size, h)),
          chevron(size, h),
        ],
      ),
      h.div(
        [
          h.Class(
            "m-0 max-h-80 overflow-y-auto rounded-lg bg-bg-primary p-1 shadow-lg ring-1 ring-border-secondary-alt backdrop:bg-transparent",
          ),
          h.Id(popoverId),
          h.Popover("auto"),
          h.Role("listbox"),
          h.AriaLabel(props.label ?? props.name),
          h.OnToggle(props.onOpenChanged),
          h.Style({
            "position-anchor": `--${selectId}`,
            "position-area": "bottom span-right",
            width: "anchor-size(width)",
          }),
        ],
        props.items.map((item, index) => {
          const isSelected = item.id === props.selectedId;
          const disabled = item.isDisabled === true;
          return h.button(
            [
              h.Class(
                `flex w-full items-center rounded-md text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 ${size === "lg" ? "gap-2 p-2.5 pl-2 text-md" : size === "md" ? "gap-2 p-2 pr-2.5 text-md" : "gap-2 p-2 pr-2.5 text-sm"} ${isSelected ? "bg-bg-primary-hover" : ""} ${disabled ? "opacity-50" : ""}`,
              ),
              h.Type("button"),
              h.Role("option"),
              h.AriaSelected(isSelected),
              h.Disabled(disabled),
              h.Tabindex(item.id === activeId ? 0 : -1),
              h.DataAttribute("select", selectId),
              h.DataAttribute("select-item", item.id),
              h.Popovertarget(popoverId),
              h.Popovertargetaction("hide"),
              h.OnClick(item.onSelect),
              h.OnKeyDownFocus((key) => moveFocus(props, selectId, index, key)),
            ],
            [...itemCopy(item, size, h), ...(isSelected ? [check(h)] : [])],
          );
        }),
      ),
      ...(props.hint === undefined
        ? []
        : [
            h.span(
              [
                h.Class(
                  `text-sm ${props.isInvalid === true ? "text-text-error-primary" : "text-text-tertiary"}`,
                ),
                ...(props.isInvalid === true ? [h.Role("alert")] : []),
              ],
              [props.hint],
            ),
          ]),
    ],
  );
};
