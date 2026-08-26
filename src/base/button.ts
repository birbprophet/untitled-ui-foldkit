/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/complexity -- FoldKit attributes and upstream variant tables stay local to the renderer. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link-color"
  | "link-gray"
  | "primary-destructive"
  | "secondary-destructive"
  | "tertiary-destructive"
  | "link-destructive";

export interface ButtonProps<Message> {
  readonly className?: string;
  readonly color?: ButtonColor;
  readonly form?: string;
  readonly href?: string;
  readonly iconLeadingElement?: Html;
  readonly iconLeading?: boolean;
  readonly iconTrailing?: boolean;
  readonly isDisabled?: boolean;
  readonly isIconOnly?: boolean;
  readonly isLoading?: boolean;
  readonly label: string;
  readonly noTextPadding?: boolean;
  readonly onPress?: NoInfer<Message>;
  readonly showTextWhileLoading?: boolean;
  readonly size?: ButtonSize;
  readonly type?: "button" | "reset" | "submit";
}

const sizeClasses: Record<ButtonSize, string> = {
  lg: "gap-1.5 rounded-lg px-4 py-2.5 text-md font-semibold before:rounded-[7px] data-icon-only:p-3",
  md: "gap-1 rounded-lg px-3.5 py-2.5 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2.5",
  sm: "gap-1 rounded-lg px-3 py-2 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2",
  xl: "gap-1.5 rounded-lg px-4.5 py-3 text-md font-semibold before:rounded-[7px] data-icon-only:p-3.5",
  xs: "gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2 *:data-icon:size-4 *:data-icon:stroke-[2.25px]",
};

const colorClasses: Record<ButtonColor, string> = {
  "link-color":
    "justify-normal rounded p-0! text-text-brand-secondary hover:text-text-brand-secondary-hover *:data-icon:text-fg-brand-secondary-alt hover:*:data-icon:text-fg-brand-secondary-hover *:data-text:underline *:data-text:decoration-transparent hover:*:data-text:decoration-fg-brand-secondary-alt",
  "link-destructive":
    "justify-normal rounded p-0! text-text-error-primary outline-error hover:text-text-error-primary-hover *:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current",
  "link-gray":
    "justify-normal rounded p-0! text-text-tertiary hover:text-text-tertiary-hover *:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary-hover *:data-text:underline *:data-text:decoration-transparent hover:*:data-text:decoration-fg-quaternary",
  primary:
    "bg-bg-brand-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset hover:bg-bg-brand-solid-hover data-loading:bg-bg-brand-solid-hover before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0% *:data-icon:text-white/60 hover:*:data-icon:text-white/70",
  "primary-destructive":
    "bg-bg-error-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent outline-error ring-inset hover:bg-bg-error-solid-hover data-loading:bg-bg-error-solid-hover before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0%",
  secondary:
    "bg-bg-primary text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset hover:bg-bg-primary-hover data-loading:bg-bg-primary-hover *:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary-hover",
  "secondary-destructive":
    "bg-bg-primary text-text-error-primary shadow-xs-skeuomorphic ring-1 ring-border-error-subtle ring-inset hover:bg-bg-error-primary hover:text-text-error-primary-hover data-loading:bg-bg-error-primary",
  tertiary:
    "text-text-tertiary hover:bg-bg-primary-hover hover:text-text-tertiary-hover data-loading:bg-bg-primary-hover *:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary-hover",
  "tertiary-destructive":
    "text-text-error-primary hover:bg-bg-error-primary hover:text-text-error-primary-hover data-loading:bg-bg-error-primary",
};

const chevron = <Message>(
  direction: "leading" | "trailing",
  loading: boolean,
  showTextWhileLoading: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.svg(
    [
      h.Class(
        `pointer-events-none size-5 shrink-0 text-current/70 transition-inherit-all ${loading && showTextWhileLoading ? "hidden" : ""} ${loading && !showTextWhileLoading ? "invisible" : ""}`,
      ),
      h.DataAttribute("icon", direction),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.path([
        h.D(direction === "leading" ? "M11.5 5.5 7 10l4.5 4.5" : "m8.5 5.5 4.5 4.5-4.5 4.5"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const spinner = <Message>(showTextWhileLoading: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.Class(
        `pointer-events-none size-5 shrink-0 text-current transition-inherit-all ${showTextWhileLoading ? "" : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}`,
      ),
      h.DataAttribute("icon", "loading"),
      h.Fill("none"),
      h.ViewBox("0 0 20 20"),
    ],
    [
      h.circle([
        h.Class("stroke-current opacity-30"),
        h.Cx("10"),
        h.Cy("10"),
        h.R("8"),
        h.Fill("none"),
        h.StrokeWidth("2"),
      ]),
      h.circle([
        h.Class("origin-center animate-spin stroke-current"),
        h.Cx("10"),
        h.Cy("10"),
        h.R("8"),
        h.Fill("none"),
        h.StrokeDasharray("12.5 50"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const button = <Message>(props: ButtonProps<Message>, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const color = props.color ?? "primary";
  const disabled = props.isDisabled === true;
  const loading = props.isLoading === true;
  const showTextWhileLoading = props.showTextWhileLoading === true;
  const iconOnly = props.isIconOnly === true;
  const leadingIcon =
    props.iconLeadingElement ??
    (props.iconLeading === true ? chevron("leading", loading, showTextWhileLoading, h) : undefined);
  const children = [
    ...(leadingIcon === undefined ? [] : [leadingIcon]),
    ...(loading ? [spinner(showTextWhileLoading, h)] : []),
    ...(iconOnly
      ? []
      : [
          h.span(
            [
              h.Class(
                `transition-inherit-all ${props.noTextPadding === true || color.startsWith("link-") ? "" : "px-0.5"} ${loading && !showTextWhileLoading ? "invisible" : ""}`,
              ),
              h.DataAttribute("text", ""),
            ],
            [props.label],
          ),
        ]),
    ...(props.iconTrailing === true ? [chevron("trailing", loading, showTextWhileLoading, h)] : []),
  ];
  const classes = [
    "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-focus-ring transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 *:data-icon:pointer-events-none *:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:transition-inherit-all",
    sizeClasses[size],
    colorClasses[color],
    props.className ?? "",
  ].join(" ");
  if (props.href !== undefined) {
    return h.a(
      [
        h.Class(`${classes} ${disabled || loading ? "pointer-events-none" : ""}`),
        ...(disabled || loading ? [] : [h.Href(props.href)]),
        h.AriaDisabled(disabled || loading),
        ...(iconOnly ? [h.AriaLabel(props.label), h.DataAttribute("icon-only", "true")] : []),
        ...(loading && !showTextWhileLoading ? [h.AriaLabel(props.label)] : []),
        ...(loading ? [h.DataAttribute("loading", "true")] : []),
      ],
      children,
    );
  }
  return h.button(
    [
      h.Class(classes),
      h.Type(props.type ?? "button"),
      ...(props.form === undefined ? [] : [h.Attribute("form", props.form)]),
      h.Disabled(disabled),
      h.AriaDisabled(loading),
      h.AriaBusy(loading),
      ...(iconOnly ? [h.AriaLabel(props.label), h.DataAttribute("icon-only", "true")] : []),
      ...(loading && !showTextWhileLoading ? [h.AriaLabel(props.label)] : []),
      ...(loading ? [h.DataAttribute("loading", "true")] : []),
      ...(loading ? [h.DataAttribute("pending", "true")] : []),
      ...(props.onPress === undefined || disabled || loading ? [] : [h.OnClick(props.onPress)]),
    ],
    children,
  );
};
