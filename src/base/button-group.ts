/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Upstream item variants remain explicit at the renderer boundary. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ButtonGroupItem<Message> {
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly leadingIcon?: Html;
  readonly message: NoInfer<Message>;
  readonly trailingIcon?: Html;
}

export interface ButtonGroupProps<Message> {
  readonly items: readonly ButtonGroupItem<NoInfer<Message>>[];
  readonly label: string;
  readonly selectedId?: string;
  readonly size?: "sm" | "md" | "lg";
}

const rootClass =
  "group/button-group inline-flex h-max cursor-pointer items-center bg-bg-primary font-semibold whitespace-nowrap text-text-secondary shadow-skeuomorphic ring-1 ring-border-primary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-bg-primary-hover hover:text-text-secondary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-text-disabled disabled:*:opacity-50";

const sizeClasses = {
  lg: "gap-2 px-4.5 py-2.5 text-md not-last:pr-[calc(calc(var(--spacing)*4.5)+1px)] first:rounded-l-lg last:rounded-r-lg",
  md: "gap-1.5 px-4 py-2.5 text-sm not-last:pr-[calc(calc(var(--spacing)*4)+1px)] first:rounded-l-lg last:rounded-r-lg",
  sm: "gap-1.5 px-3.5 py-2 text-sm not-last:pr-[calc(calc(var(--spacing)*3.5)+1px)] first:rounded-l-lg last:rounded-r-lg",
} as const;

export const buttonGroup = <Message>(
  props: ButtonGroupProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "md";
  return h.div(
    [
      h.AriaLabel(props.label),
      h.Class("relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-xs"),
      h.Role("group"),
    ],
    props.items.map((item) => {
      const selected = item.id === props.selectedId;
      return h.button(
        [
          h.AriaPressed(String(selected)),
          h.Class(
            `${rootClass} ${sizeClasses[size]} ${selected ? "bg-bg-primary-hover text-text-secondary-hover" : ""}`,
          ),
          h.Disabled(item.isDisabled ?? false),
          h.Type("button"),
          ...(item.isDisabled === true ? [] : [h.OnClick(item.message)]),
        ],
        [
          ...(item.leadingIcon === undefined ? [] : [item.leadingIcon]),
          item.label,
          ...(item.trailingIcon === undefined ? [] : [item.trailingIcon]),
        ],
      );
    }),
  );
};
