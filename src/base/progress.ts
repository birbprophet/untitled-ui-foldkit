/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noSwitchStatement, effect/noTernary, mps/prefer-match-over-switch, typescript/switch-exhaustiveness-check -- Upstream progress variants are a closed visual table and FoldKit attributes remain local. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ProgressIndicatorProps {
  readonly label?: string;
  readonly labelPosition?: "right" | "bottom" | "top-floating" | "bottom-floating";
  readonly max?: number;
  readonly min?: number;
  readonly value: number;
}

export interface ProgressCircleProps {
  readonly kind?: "circle" | "half-circle";
  readonly label?: string;
  readonly max?: number;
  readonly min?: number;
  readonly size: "xxs" | "xs" | "sm" | "md" | "lg";
  readonly value: number;
}

export interface SimpleCircleProps {
  readonly max?: 100;
  readonly min?: 0;
  readonly value: number;
}

const percentageOf = (value: number, min: number, max: number): number =>
  ((value - min) * 100) / (max - min);

const progressAttributes = <Message>(
  value: number,
  min: number,
  max: number,
  h: HtmlBuilder<Message>,
) => [h.Role("progressbar"), h.AriaValuenow(value), h.AriaValuemin(min), h.AriaValuemax(max)];

const progressTrack = <Message>(
  value: number,
  min: number,
  max: number,
  h: HtmlBuilder<Message>,
): Html => {
  const percentage = percentageOf(value, min, max);
  return h.div(
    [
      ...progressAttributes(value, min, max, h),
      h.Class("h-2 w-full overflow-hidden rounded-md bg-bg-quaternary"),
    ],
    [
      h.div([
        h.Class("size-full rounded-md bg-fg-brand-primary transition duration-75 ease-linear"),
        h.Style({ transform: `translateX(-${String(100 - percentage)}%)` }),
      ]),
    ],
  );
};

export const progressIndicator = <Message>(
  props: ProgressIndicatorProps,
  h: HtmlBuilder<Message>,
): Html => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const percentage = percentageOf(props.value, min, max);
  const formatted = `${percentage.toFixed(0)}%`;
  const track = progressTrack(props.value, min, max, h);
  switch (props.labelPosition) {
    case "right": {
      return h.div(
        [h.Class("flex items-center gap-3")],
        [
          track,
          h.span(
            [h.Class("shrink-0 text-sm font-medium text-text-secondary tabular-nums")],
            [formatted],
          ),
        ],
      );
    }
    case "bottom": {
      return h.div(
        [h.Class("flex flex-col items-end gap-2")],
        [
          track,
          h.span([h.Class("text-sm font-medium text-text-secondary tabular-nums")], [formatted]),
        ],
      );
    }
    case "top-floating":
    case "bottom-floating": {
      return h.div(
        [h.Class("relative flex flex-col items-end gap-2")],
        [
          track,
          h.div(
            [
              h.Class(
                `absolute ${props.labelPosition === "top-floating" ? "-top-2 -translate-y-full" : "-bottom-2 translate-y-full"} -translate-x-1/2 rounded-lg bg-bg-primary-alt px-3 py-2 shadow-lg ring-1 ring-border-secondary-alt`,
              ),
              h.Style({ left: `${String(percentage)}%` }),
            ],
            [
              h.div(
                [h.Class("text-xs font-semibold text-text-secondary tabular-nums")],
                [formatted],
              ),
            ],
          ),
        ],
      );
    }
    default: {
      return track;
    }
  }
};

const circleSizes = {
  lg: {
    halfPosition: "bottom-0",
    label: "text-sm",
    radius: 126,
    stroke: 28,
    value: "text-display-lg",
  },
  md: {
    halfPosition: "bottom-1",
    label: "text-sm",
    radius: 108,
    stroke: 24,
    value: "text-display-md",
  },
  sm: {
    halfPosition: "bottom-2",
    label: "text-xs",
    radius: 90,
    stroke: 20,
    value: "text-display-sm",
  },
  xs: {
    halfPosition: "bottom-0.5",
    label: "text-xs",
    radius: 72,
    stroke: 16,
    value: "text-display-xs",
  },
  xxs: { halfPosition: "bottom-0.5", label: "text-xs", radius: 29, stroke: 6, value: "text-sm" },
} as const;

const circleText = <Message>(
  props: ProgressCircleProps,
  formatted: string,
  half: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const size = circleSizes[props.size];
  const position = half ? `absolute ${size.halfPosition} text-center` : "absolute text-center";
  if (props.label !== undefined && props.size !== "xxs") {
    return h.div(
      [h.Class(position)],
      [
        h.div([h.Class(`${size.label} font-medium text-text-tertiary`)], [props.label]),
        h.div([h.Class(`${size.value} font-semibold text-text-primary`)], [formatted]),
      ],
    );
  }
  return h.span(
    [h.Class(`${position} ${size.value} font-semibold text-text-primary`)],
    [formatted],
  );
};

const circleSvg = <Message>(
  props: ProgressCircleProps,
  percentage: number,
  half: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const size = circleSizes[props.size];
  const width = 2 * (size.radius + size.stroke / 2);
  const height = half ? size.radius + size.stroke : width;
  const centerX = half ? "50%" : String(width / 2);
  const centerY = half ? String(size.radius + size.stroke / 2) : String(width / 2);
  const common = [
    h.Cx(centerX),
    h.Cy(centerY),
    h.R(String(size.radius)),
    h.Fill("none"),
    h.StrokeWidth(String(size.stroke)),
    h.PathLength("100"),
    h.StrokeDasharray("100"),
    h.StrokeLinecap("round"),
  ];
  return h.svg(
    [
      h.Class(half ? "" : "-rotate-90"),
      h.Width(String(width)),
      h.Height(String(height)),
      h.ViewBox(`0 0 ${String(width)} ${String(height)}`),
    ],
    [
      h.circle([
        h.Class("stroke-bg-quaternary"),
        ...common,
        ...(half ? [h.StrokeDashoffset("-50")] : []),
      ]),
      h.circle([
        h.Class(
          half ? "origin-center -scale-x-100 stroke-fg-brand-primary" : "stroke-fg-brand-primary",
        ),
        ...common,
        h.StrokeDashoffset(half ? String(-50 - (100 - percentage) / 2) : String(100 - percentage)),
      ]),
    ],
  );
};

export const progressCircle = <Message>(
  props: ProgressCircleProps,
  h: HtmlBuilder<Message>,
): Html => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const percentage = Math.round(percentageOf(props.value, min, max));
  const half = props.kind === "half-circle";
  const body = h.div(
    [
      ...progressAttributes(props.value, min, max, h),
      h.Class("relative flex w-max items-center justify-center"),
    ],
    [circleSvg(props, percentage, half, h), circleText(props, `${String(percentage)}%`, half, h)],
  );
  return h.div(
    [h.Class("flex flex-col items-center gap-0.5")],
    [
      body,
      ...(props.label !== undefined && props.size === "xxs"
        ? [
            h.div(
              [h.Class(`${circleSizes.xxs.label} font-medium text-text-tertiary`)],
              [props.label],
            ),
          ]
        : []),
    ],
  );
};

export const simpleCircle = <Message>(props: SimpleCircleProps, h: HtmlBuilder<Message>): Html => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const percentage = percentageOf(props.value, min, max);
  const common = [h.Cx("30"), h.Cy("30"), h.R("26"), h.Fill("none"), h.StrokeWidth("6")];
  return h.div(
    [
      ...progressAttributes(props.value, min, max, h),
      h.Class("relative flex w-max items-center justify-center"),
    ],
    [
      h.span(
        [h.Class("absolute text-sm font-medium text-text-primary")],
        [`${String(percentage)}%`],
      ),
      h.svg(
        [h.Class("size-16 -rotate-90"), h.ViewBox("0 0 60 60")],
        [
          h.circle([h.Class("stroke-bg-quaternary"), ...common]),
          h.circle([
            h.Class("stroke-fg-brand-primary"),
            ...common,
            h.StrokeDashoffset(String(100 - percentage)),
            h.StrokeDasharray("100"),
            h.PathLength("100"),
            h.StrokeLinecap("round"),
          ]),
        ],
      ),
    ],
  );
};
