/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/no-nested-ternary, unicorn/no-nested-ternary -- The upstream chart primitives are a closed legend, tooltip, and active-dot union. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ChartLegendItem {
  readonly colorClass: string;
  readonly label: string;
}

export interface ChartLegendProps {
  readonly align?: "center" | "left" | "right";
  readonly items: readonly ChartLegendItem[];
  readonly kind: "legend";
  readonly layout?: "horizontal" | "vertical";
  readonly reversed?: boolean;
}

export interface ChartTooltipItem {
  readonly label: string;
  readonly value: string;
}

export interface ChartTooltipProps {
  readonly items?: readonly ChartTooltipItem[];
  readonly kind: "tooltip";
  readonly secondaryTitle?: string;
  readonly title: string;
}

export interface ChartActiveDotProps {
  readonly kind: "active-dot";
  readonly x?: number;
  readonly y?: number;
}

export type ChartsBaseProps = ChartActiveDotProps | ChartLegendProps | ChartTooltipProps;

const legend = <Message>(props: ChartLegendProps, h: HtmlBuilder<Message>): Html => {
  const layout = props.layout ?? "horizontal";
  const align = props.align ?? "left";
  const alignment =
    layout === "vertical"
      ? align === "center"
        ? "items-center"
        : "items-start"
      : align === "center"
        ? "justify-center"
        : align === "right"
          ? "justify-end"
          : "justify-start";
  const items = props.reversed === true ? props.items.toReversed() : props.items;
  return h.ul(
    [
      h.Class(
        `flex ${layout === "vertical" ? "flex-col gap-1 pl-4" : "flex-row gap-3"} ${alignment}`,
      ),
    ],
    items.map((item) =>
      h.li(
        [h.Class("flex items-center gap-2 text-sm text-text-tertiary")],
        [
          h.span([
            h.AriaHidden(true),
            h.Class(
              `block size-2 rounded-full bg-current ring-[0.5px] ring-black/10 ring-inset ${item.colorClass}`,
            ),
          ]),
          item.label,
        ],
      ),
    ),
  );
};

const tooltip = <Message>(props: ChartTooltipProps, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex flex-col gap-0.5 rounded-lg bg-bg-primary-solid px-3 py-2 shadow-lg")],
    [
      h.p([h.Class("text-xs font-semibold text-white")], [props.title]),
      ...(props.items === undefined
        ? props.secondaryTitle === undefined
          ? []
          : [h.p([h.Class("text-xs text-tooltip-supporting-text")], [props.secondaryTitle])]
        : [
            h.div(
              [],
              props.items.map((item) =>
                h.p(
                  [h.Class("text-xs text-tooltip-supporting-text")],
                  [`${item.label}: ${item.value}`],
                ),
              ),
            ),
          ]),
    ],
  );

const activeDot = <Message>(props: ChartActiveDotProps, h: HtmlBuilder<Message>): Html => {
  const size = 12;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Fill("none"),
      h.Height(String(size)),
      h.ViewBox("0 0 12 12"),
      h.Width(String(size)),
      h.X(String((props.x ?? size / 2) - size / 2)),
      h.Y(String((props.y ?? size / 2) - size / 2)),
    ],
    [
      h.rect([
        h.Class("fill-bg-primary stroke-utility-brand-600"),
        h.Height("8"),
        h.Rx("6"),
        h.StrokeWidth("2"),
        h.Width("8"),
        h.X("2"),
        h.Y("2"),
      ]),
    ],
  );
};

export const chartsBase = <Message>(props: ChartsBaseProps, h: HtmlBuilder<Message>): Html => {
  if (props.kind === "legend") {
    return legend(props, h);
  }
  return props.kind === "tooltip" ? tooltip(props, h) : activeDot(props, h);
};
