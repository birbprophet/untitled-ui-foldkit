/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- Native form semantics and upstream state classes stay explicit. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface CheckboxProps<Message> {
  readonly hint?: string;
  readonly isDisabled?: boolean;
  readonly isIndeterminate?: boolean;
  readonly isSelected?: boolean;
  readonly label?: string;
  readonly name?: string;
  readonly onToggle?: NoInfer<Message>;
  readonly size?: "sm" | "md";
  readonly value?: string;
}

const checkIcon = <Message>(indeterminate: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none size-3.5 text-fg-white"),
      h.Fill("none"),
      h.ViewBox("0 0 14 14"),
    ],
    [
      h.path([
        h.D(indeterminate ? "M2.91675 7H11.0834" : "M11.6666 3.5 5.24992 9.91667 2.33325 7"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const checkbox = <Message>(props: CheckboxProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const selected = props.isSelected === true;
  const indeterminate = props.isIndeterminate === true;
  const disabled = props.isDisabled === true;
  const hasCopy = props.label !== undefined || props.hint !== undefined;
  const toggleMessage = props.onToggle;
  const controlId = `checkbox-${(props.name ?? props.label ?? "control").toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`;
  const labelId = `${controlId}-label`;
  const hintId = `${controlId}-hint`;
  return h.label(
    [
      h.Class(
        `relative flex items-start ${size === "md" ? "gap-3" : "gap-2"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`,
      ),
    ],
    [
      h.input([
        h.Class("peer sr-only"),
        h.Type("checkbox"),
        h.Checked(selected),
        h.Disabled(disabled),
        h.AriaChecked(indeterminate ? "mixed" : selected),
        ...(hasCopy
          ? [h.Attribute("aria-labelledby", props.label === undefined ? hintId : labelId)]
          : []),
        ...(props.hint === undefined ? [] : [h.AriaDescribedBy(hintId)]),
        ...(props.name === undefined ? [] : [h.Name(props.name)]),
        ...(props.value === undefined ? [] : [h.Value(props.value)]),
        ...(toggleMessage === undefined || disabled ? [] : [h.OnChange(() => toggleMessage)]),
      ]),
      h.span(
        [
          h.Class(
            `relative mt-0.5 flex shrink-0 items-center justify-center ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${size === "md" ? "size-5 rounded-md" : "size-4 rounded"} ${selected || indeterminate ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"} ${disabled ? "opacity-50" : ""}`,
          ),
        ],
        selected || indeterminate ? [checkIcon(indeterminate, h)] : [],
      ),
      ...(hasCopy
        ? [
            h.span(
              [h.Class(`inline-flex flex-col ${size === "md" ? "gap-0.5" : ""}`)],
              [
                ...(props.label === undefined
                  ? []
                  : [
                      h.span(
                        [
                          h.Id(labelId),
                          h.Class(
                            `${size === "md" ? "text-md" : "text-sm"} font-medium text-text-secondary select-none`,
                          ),
                        ],
                        [props.label],
                      ),
                    ]),
                ...(props.hint === undefined
                  ? []
                  : [
                      h.span(
                        [
                          h.Id(hintId),
                          h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`),
                        ],
                        [props.hint],
                      ),
                    ]),
              ],
            ),
          ]
        : []),
    ],
  );
};

export interface RadioItem<Message> {
  readonly hint?: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly message: NoInfer<Message>;
  readonly value: string;
}

export interface RadioButtonsProps<Message> {
  readonly isDisabled?: boolean;
  readonly items: readonly RadioItem<Message>[];
  readonly label: string;
  readonly name: string;
  readonly selectedValue?: string;
  readonly size?: "sm" | "md";
}

const radioDot = <Message>(selected: boolean, size: "sm" | "md", h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `flex shrink-0 items-center justify-center rounded-full ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring ${size === "md" ? "size-5" : "size-4"} ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    [
      h.span([
        h.Class(
          `${size === "md" ? "size-2" : "size-1.5"} rounded-full bg-fg-white ${selected ? "opacity-100" : "opacity-0"}`,
        ),
      ]),
    ],
  );

export const radioButtons = <Message>(
  props: RadioButtonsProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  return h.fieldset(
    [h.Class("flex flex-col gap-4"), h.Disabled(props.isDisabled === true)],
    [
      h.legend([h.Class("sr-only")], [props.label]),
      ...props.items.map((item) => {
        const selected = item.value === props.selectedValue;
        const disabled = props.isDisabled === true || item.isDisabled === true;
        return h.label(
          [
            h.Class(
              `relative flex items-start ${size === "md" ? "gap-3" : "gap-2"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
            ),
          ],
          [
            h.input([
              h.Class("peer sr-only"),
              h.Type("radio"),
              h.Name(props.name),
              h.Value(item.value),
              h.Checked(selected),
              h.Disabled(disabled),
              h.Attribute("aria-labelledby", `${props.name}-${item.value}-label`),
              ...(item.hint === undefined
                ? []
                : [h.AriaDescribedBy(`${props.name}-${item.value}-hint`)]),
              h.OnChange(() => item.message),
            ]),
            radioDot(selected, size, h),
            h.span(
              [h.Class(`inline-flex flex-col ${size === "md" ? "gap-0.5" : ""}`)],
              [
                h.span(
                  [
                    h.Id(`${props.name}-${item.value}-label`),
                    h.Class(
                      `${size === "md" ? "text-md" : "text-sm"} font-medium text-text-secondary select-none`,
                    ),
                  ],
                  [item.label],
                ),
                ...(item.hint === undefined
                  ? []
                  : [
                      h.span(
                        [
                          h.Id(`${props.name}-${item.value}-hint`),
                          h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`),
                        ],
                        [item.hint],
                      ),
                    ]),
              ],
            ),
          ],
        );
      }),
    ],
  );
};

export interface ToggleProps<Message> {
  readonly ariaLabel?: string;
  readonly hint?: string;
  readonly isDisabled?: boolean;
  readonly isSelected?: boolean;
  readonly label?: string;
  readonly name?: string;
  readonly onToggle?: NoInfer<Message>;
  readonly size?: "sm" | "md";
  readonly slim?: boolean;
}

export const toggle = <Message>(props: ToggleProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const selected = props.isSelected === true;
  const slim = props.slim === true;
  const disabled = props.isDisabled === true;
  const toggleMessage = props.onToggle;
  const controlId = `toggle-${(props.name ?? props.label ?? "control").toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`;
  const labelId = `${controlId}-label`;
  const hintId = `${controlId}-hint`;
  const rootSize = slim
    ? size === "md"
      ? "h-5 w-10"
      : "h-4 w-8"
    : size === "md"
      ? "h-6 w-11 p-0.5"
      : "h-5 w-9 p-0.5";
  const thumbSize = size === "md" ? "size-5" : "size-4";
  const shift = selected ? (size === "md" ? "translate-x-5" : "translate-x-4") : "";
  return h.label(
    [
      h.Class(
        `relative flex w-max items-start ${size === "md" ? "gap-3" : "gap-2"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`,
      ),
    ],
    [
      h.input([
        ...(props.ariaLabel === undefined ? [] : [h.AriaLabel(props.ariaLabel)]),
        h.Class("peer sr-only"),
        h.Type("checkbox"),
        h.Attribute("role", "switch"),
        h.Checked(selected),
        h.Disabled(disabled),
        ...(props.label === undefined && props.hint === undefined
          ? []
          : [h.Attribute("aria-labelledby", props.label === undefined ? hintId : labelId)]),
        ...(props.hint === undefined ? [] : [h.AriaDescribedBy(hintId)]),
        ...(props.name === undefined ? [] : [h.Name(props.name)]),
        ...(toggleMessage === undefined || disabled ? [] : [h.OnChange(() => toggleMessage)]),
      ]),
      h.span(
        [
          h.Class(
            `mt-0.5 rounded-full ring-[0.5px] ring-border-secondary outline-focus-ring transition duration-150 ease-linear ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${rootSize} ${selected ? "bg-bg-brand-solid" : "bg-bg-tertiary"} ${disabled ? "opacity-50" : ""}`,
          ),
        ],
        [
          h.span([
            h.Class(
              `block rounded-full bg-fg-white shadow-sm transition-transform duration-150 ease-linear ${thumbSize} ${shift} ${slim ? "border border-border-primary shadow-xs" : ""}`,
            ),
          ]),
        ],
      ),
      ...(props.label === undefined && props.hint === undefined
        ? []
        : [
            h.span(
              [h.Class(`flex flex-col ${size === "md" ? "gap-0.5" : ""}`)],
              [
                ...(props.label === undefined
                  ? []
                  : [
                      h.span(
                        [
                          h.Id(labelId),
                          h.Class(
                            `${size === "md" ? "text-md" : "text-sm"} font-medium text-text-secondary select-none`,
                          ),
                        ],
                        [props.label],
                      ),
                    ]),
                ...(props.hint === undefined
                  ? []
                  : [
                      h.span(
                        [
                          h.Id(hintId),
                          h.Class(`${size === "md" ? "text-md" : "text-sm"} text-text-tertiary`),
                        ],
                        [props.hint],
                      ),
                    ]),
              ],
            ),
          ]),
    ],
  );
};

export interface SliderProps<Message> {
  readonly label: string;
  readonly labelPosition?: "default" | "bottom" | "top-floating";
  readonly max?: number;
  readonly min?: number;
  readonly onChange: (value: number) => NoInfer<Message>;
  readonly step?: number;
  readonly value: number;
}

export const slider = <Message>(props: SliderProps<Message>, h: HtmlBuilder<Message>): Html => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const percentage = ((props.value - min) * 100) / (max - min);
  const keyboardValue = (key: string): Option.Option<Message> => {
    const clamp = (nextSliderValue: number): number =>
      Math.min(max, Math.max(min, nextSliderValue));
    const keyboardTargets: Readonly<Record<string, number>> = {
      ArrowDown: clamp(props.value - step),
      ArrowLeft: clamp(props.value - step),
      ArrowRight: clamp(props.value + step),
      ArrowUp: clamp(props.value + step),
      End: max,
      Home: min,
      PageDown: clamp(props.value - step * 10),
      PageUp: clamp(props.value + step * 10),
    };
    return Option.fromNullishOr(keyboardTargets[key]).pipe(
      Option.map((nextSliderValue) => props.onChange(nextSliderValue)),
    );
  };
  const output =
    props.labelPosition === "default"
      ? "sr-only"
      : props.labelPosition === "bottom"
        ? "absolute top-2 left-1/2 -translate-x-1/2 translate-y-full text-md font-medium text-text-primary"
        : "absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-lg bg-bg-primary px-2 py-1.5 text-xs font-semibold text-text-secondary shadow-lg ring-1 ring-border-secondary-alt";
  return h.label(
    [h.Class("block")],
    [
      h.span([h.Class("sr-only")], [props.label]),
      h.span(
        [h.Class("relative block h-6 w-full")],
        [
          h.span([
            h.Class("absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-bg-quaternary"),
          ]),
          h.span([
            h.Class("absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-bg-brand-solid"),
            h.Style({ width: `${String(percentage)}%` }),
          ]),
          h.input([
            h.Class(
              "uui-range absolute inset-0 size-full cursor-pointer appearance-none bg-transparent focus:outline-none",
            ),
            h.Type("range"),
            h.Min(String(min)),
            h.Max(String(max)),
            h.Step(String(step)),
            h.Value(String(props.value)),
            h.AriaLabel(props.label),
            h.OnInput((value) => props.onChange(Number(value))),
            h.OnKeyDownPreventDefault(keyboardValue),
          ]),
          h.output(
            [h.Class(output), h.Style({ left: `${String(percentage)}%` })],
            [`${String(Math.round(percentage))}%`],
          ),
        ],
      ),
    ],
  );
};
