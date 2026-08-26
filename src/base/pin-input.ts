/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Placeholder is the upstream empty-slot color; the six size and slot states stay explicit. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type PinInputSize = "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg";

export interface PinInputProps<Message> {
  readonly description?: string;
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly isFocused?: boolean;
  readonly isInvalid?: boolean;
  readonly label: string;
  readonly maxLength?: number;
  readonly onBlur?: NoInfer<Message>;
  readonly onFocus?: NoInfer<Message>;
  readonly onInput: (value: string) => NoInfer<Message>;
  readonly separatorAfter?: readonly number[];
  readonly size?: PinInputSize;
  readonly value: string;
}

const styles = {
  lg: {
    caret: "text-display-xl font-medium",
    group: "h-24.5 gap-3",
    slot: "size-24 rounded-xl px-2 py-3 text-display-xl font-medium",
  },
  md: {
    caret: "text-display-lg font-medium",
    group: "h-20.5 gap-3",
    slot: "size-20 rounded-xl px-2 py-2.5 text-display-lg font-medium",
  },
  sm: {
    caret: "text-display-lg font-medium",
    group: "h-16.5 gap-2",
    slot: "size-16 rounded-xl px-2 py-0.5 text-display-lg font-medium",
  },
  xs: {
    caret: "text-md font-medium",
    group: "h-11 gap-2",
    slot: "size-11 rounded-lg px-3.5 py-2.5 text-md font-medium",
  },
  xxs: {
    caret: "text-md font-medium",
    group: "h-10 gap-2",
    slot: "size-10 rounded-lg px-3 py-2 text-md font-medium",
  },
  xxxs: {
    caret: "text-sm font-medium",
    group: "h-9 gap-1.5",
    slot: "size-9 rounded-lg px-3 py-2 text-sm font-medium",
  },
} as const;

const caret = <Message>(size: PinInputSize, h: HtmlBuilder<Message>): Html =>
  h.span([
    h.AriaHidden(true),
    h.Class(
      `pointer-events-none h-[1em] w-0.5 animate-caret-blink bg-fg-brand-primary ${styles[size].caret}`,
    ),
  ]);

const slotState = (isInvalid: boolean, hasCharacter: boolean, isActive: boolean): string => {
  if (isInvalid) {
    return hasCharacter
      ? "text-text-error-primary ring-2 ring-border-error-subtle"
      : "text-text-error-primary ring-1 ring-border-error-subtle";
  }
  if (hasCharacter) {
    return "text-text-brand-tertiary-alt ring-2 ring-border-brand";
  }
  if (isActive) {
    return "text-text-placeholder/40 ring-2 ring-border-brand outline-2 outline-offset-2 outline-border-brand";
  }
  return "text-text-placeholder/40 ring-1 ring-border-primary";
};

export const pinInput = <Message>(props: PinInputProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "md";
  const maxLength = props.maxLength ?? 4;
  const value = props.value.slice(0, maxLength);
  const activeIndex = Math.min(value.length, maxLength - 1);
  const inputId = `${props.id}-input`;
  const descriptionId = `${props.id}-description`;
  const slots = Array.from({ length: maxLength }, (_, index) => {
    const character = value.at(index);
    const active = props.isFocused === true && index === activeIndex;
    const visualState = slotState(props.isInvalid === true, character !== undefined, active);
    const slot = h.div(
      [
        h.AriaHidden(true),
        h.Class(
          `relative flex items-center justify-center bg-bg-primary text-center shadow-xs transition-[box-shadow,background-color] duration-100 ease-linear ring-inset ${styles[size].slot} ${visualState} ${props.isDisabled === true ? "opacity-50" : ""}`,
        ),
      ],
      [character ?? (active ? caret(size, h) : "0")],
    );
    return props.separatorAfter?.includes(index + 1) === true
      ? [
          slot,
          h.div(
            [
              h.Class("text-center text-display-xl font-medium text-utility-neutral-300"),
              h.Role("separator"),
            ],
            ["-"],
          ),
        ]
      : [slot];
  }).flat();

  return h.div(
    [h.Class("flex h-max flex-col gap-1.5"), h.Role("group")],
    [
      h.label(
        [
          h.Class("text-sm font-medium text-text-secondary"),
          h.For(inputId),
          h.Id(`${props.id}-label`),
        ],
        [props.label],
      ),
      h.div(
        [h.Class(`relative flex flex-row ${styles[size].group}`)],
        [
          h.input([
            h.AriaInvalid(props.isInvalid ?? false),
            h.AriaLabelledBy(`${props.id}-label`),
            h.Autocomplete("one-time-code"),
            h.Class("absolute inset-0 cursor-text disabled:cursor-not-allowed"),
            h.Disabled(props.isDisabled ?? false),
            h.Id(inputId),
            h.InputMode("numeric"),
            h.Maxlength(maxLength),
            h.Pattern("[0-9]*"),
            h.Style({
              background: "transparent",
              border: "0 solid transparent",
              "box-shadow": "none",
              "caret-color": "transparent",
              "clip-path": "inset(0 40px 0 0)",
              color: "transparent",
              display: "flex",
              "font-family": "monospace",
              "font-size": "var(--root-height)",
              "font-variant-numeric": "tabular-nums",
              height: "100%",
              "letter-spacing": "-0.5em",
              "line-height": "1",
              opacity: "1",
              outline: "transparent solid 0",
              "pointer-events": "all",
              "text-align": "left",
              width: "calc(100% + 40px)",
            }),
            h.Type("text"),
            h.Value(value),
            h.OnInput((nextValue) => props.onInput(nextValue.replaceAll(/\D/gu, ""))),
            ...(props.description === undefined ? [] : [h.AriaDescribedBy(descriptionId)]),
            ...(props.onFocus === undefined ? [] : [h.OnFocus(props.onFocus)]),
            ...(props.onBlur === undefined ? [] : [h.OnBlur(props.onBlur)]),
          ]),
          ...slots,
        ],
      ),
      ...(props.description === undefined
        ? []
        : [
            h.p(
              [
                h.Class(`${size === "xxxs" ? "text-xs" : "text-sm"} text-text-tertiary`),
                h.Id(descriptionId),
              ],
              [props.description],
            ),
          ]),
    ],
  );
};
