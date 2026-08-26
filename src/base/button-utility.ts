/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The upstream link and button variants share one renderer. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ButtonUtilityProps<Message> {
  readonly color?: "secondary" | "tertiary";
  readonly href?: string;
  readonly icon?: (h: HtmlBuilder<Message>) => Html;
  readonly isDisabled?: boolean;
  readonly onPress?: NoInfer<Message>;
  readonly size?: "xs" | "sm";
  readonly tooltip: string;
  readonly tooltipPlacement?: "top" | "bottom" | "left" | "right";
}

const utilityIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.DataAttribute("icon", ""), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.circle([h.Cx("4"), h.Cy("10"), h.R("1.25"), h.Fill("currentColor")]),
      h.circle([h.Cx("10"), h.Cy("10"), h.R("1.25"), h.Fill("currentColor")]),
      h.circle([h.Cx("16"), h.Cy("10"), h.R("1.25"), h.Fill("currentColor")]),
    ],
  );

const tooltipPosition = {
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "top-1/2 right-full mr-1.5 -translate-y-1/2",
  right: "top-1/2 left-full ml-1.5 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
} as const;

export const buttonUtility = <Message>(
  props: ButtonUtilityProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  const disabled = props.isDisabled === true;
  const tooltipId = `button-utility-${props.tooltip.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`;
  const color =
    props.color === "tertiary"
      ? "text-fg-quaternary hover:bg-bg-primary-hover hover:text-fg-primary"
      : "bg-bg-primary text-fg-quaternary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset hover:bg-bg-primary-hover hover:text-fg-primary disabled:shadow-xs";
  const classes = `group/control relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 *:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:text-current *:data-icon:transition-inherit-all ${size === "xs" ? "*:data-icon:size-4" : "*:data-icon:size-5"} ${color}`;
  const icon = (props.icon ?? utilityIcon)(h);
  const control =
    props.href === undefined
      ? h.button(
          [
            h.Class(classes),
            h.Type("button"),
            h.AriaLabel(props.tooltip),
            h.AriaDescribedBy(tooltipId),
            h.Disabled(disabled),
            ...(props.onPress === undefined || disabled ? [] : [h.OnClick(props.onPress)]),
          ],
          [icon],
        )
      : h.a(
          [
            h.Class(`${classes} ${disabled ? "pointer-events-none opacity-50" : ""}`),
            h.AriaLabel(props.tooltip),
            h.AriaDescribedBy(tooltipId),
            h.AriaDisabled(disabled),
            ...(disabled ? [] : [h.Href(props.href)]),
          ],
          [icon],
        );
  return h.span(
    [h.Class("group/tooltip relative inline-flex")],
    [
      control,
      h.span(
        [
          h.Class(
            `pointer-events-none absolute z-50 w-max max-w-64 rounded-lg bg-bg-primary-alt px-3 py-2 text-xs font-semibold text-text-secondary opacity-0 shadow-lg ring-1 ring-border-secondary-alt transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${tooltipPosition[props.tooltipPlacement ?? "top"]}`,
          ),
          h.Id(tooltipId),
          h.Role("tooltip"),
        ],
        [props.tooltip],
      ),
    ],
  );
};
