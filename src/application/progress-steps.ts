/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/no-negated-condition, eslint/no-nested-ternary -- Untitled exposes a closed matrix of progress-step anatomy and statuses; keeping that visual table local preserves its source structure. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ProgressStepStatus = "incomplete" | "current" | "complete";
export type ProgressStepSize = "sm" | "md";
export type ProgressStepOrientation = "horizontal" | "vertical";
export type ProgressStepType = "icon" | "number" | "featured-icon";

export interface ProgressStep {
  readonly description: string;
  readonly status: ProgressStepStatus;
  readonly title: string;
}

export interface ProgressStepsProps {
  readonly connector?: boolean;
  readonly items: readonly ProgressStep[];
  readonly orientation?: ProgressStepOrientation;
  readonly showStepCount?: boolean;
  readonly size?: ProgressStepSize;
  readonly type?: ProgressStepType;
  readonly variant?:
    | "icons-with-text"
    | "minimal-icons"
    | "minimal-icons-connected"
    | "text-with-line";
}

const statusClasses = {
  complete: {
    connector: "border-border-brand",
    description: "text-text-tertiary",
    dot: "hidden",
    icon: "bg-bg-brand-solid",
    title: "text-text-secondary",
  },
  current: {
    connector: "border-border-secondary",
    description: "text-text-brand-tertiary",
    dot: "bg-fg-white",
    icon: "bg-bg-brand-solid ring-2 ring-focus-ring ring-offset-2 ring-offset-bg-primary",
    title: "text-text-brand-secondary",
  },
  incomplete: {
    connector: "border-border-secondary",
    description: "text-text-tertiary",
    dot: "bg-fg-quaternary",
    icon: "bg-bg-primary ring-[1.5px] ring-border-primary ring-inset",
    title: "text-text-secondary",
  },
} as const;

const checkIcon = <Message>(size: ProgressStepSize, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(size === "sm" ? "size-3" : "size-4"),
      h.Fill("none"),
      h.ViewBox("0 0 12 12"),
    ],
    [
      h.path([
        h.D("M10 3 4.5 8.5 2 6"),
        h.Stroke("white"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const featuredIcon = <Message>(
  status: ProgressStepStatus,
  size: ProgressStepSize,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.Class(
        `relative z-10 flex shrink-0 items-center justify-center bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset ${size === "sm" ? "size-10 rounded-lg" : "size-12 rounded-[10px]"} ${status === "incomplete" ? "text-fg-quaternary" : ""}`,
      ),
    ],
    [
      h.svg(
        [h.Class(size === "sm" ? "size-5" : "size-6"), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D(
              "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
            ),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      ),
    ],
  );

const iconOnly = <Message>(
  item: ProgressStep,
  size: ProgressStepSize,
  type: ProgressStepType,
  step: number,
  h: HtmlBuilder<Message>,
): Html => {
  if (type === "featured-icon") {
    return featuredIcon(item.status, size, h);
  }
  const status = statusClasses[item.status];
  const numberClasses =
    item.status === "complete"
      ? "bg-bg-success-solid text-fg-white"
      : `bg-bg-primary text-text-quaternary ring-1 ring-border-secondary ring-inset ${item.status === "incomplete" ? "opacity-60" : ""}`;
  return h.span(
    [
      h.AriaHidden(true),
      h.Class(
        `z-10 flex shrink-0 items-center justify-center rounded-full ${size === "sm" ? "size-6" : "size-8"} ${type === "number" ? numberClasses : status.icon}`,
      ),
    ],
    item.status === "complete"
      ? [checkIcon(size, h)]
      : type === "number"
        ? [
            h.span(
              [h.Class(`font-semibold ${size === "sm" ? "text-xs" : "text-sm"}`)],
              [String(step)],
            ),
          ]
        : [
            h.span([
              h.Class(`rounded-full ${status.dot} ${size === "sm" ? "size-2" : "size-2.5"}`),
            ]),
          ],
  );
};

const text = <Message>(
  item: ProgressStep,
  size: ProgressStepSize,
  centered: boolean,
  featured: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `flex flex-col ${size === "sm" ? "gap-0" : "gap-0.5"} ${centered ? "w-full items-center text-center" : "items-start"} ${featured && item.status === "incomplete" ? "opacity-60" : ""}`,
      ),
    ],
    [
      h.p(
        [
          h.Class(
            `${featured ? "text-text-secondary" : statusClasses[item.status].title} ${size === "sm" ? "text-sm" : "text-md"} font-semibold`,
          ),
        ],
        [item.title],
      ),
      h.p(
        [
          h.Class(
            `${featured ? "text-text-tertiary" : statusClasses[item.status].description} ${size === "sm" ? "text-sm" : "text-md"}`,
          ),
        ],
        [item.description],
      ),
    ],
  );

const horizontalConnector = <Message>(
  item: ProgressStep,
  type: ProgressStepType,
  h: HtmlBuilder<Message>,
): Html => {
  if (type === "number") {
    return h.svg(
      [
        h.AriaHidden(true),
        h.Class("absolute top-1/2 left-[53%] z-0 h-[2.5px] w-full -translate-y-1/2 max-md:hidden"),
      ],
      [
        h.line([
          h.Attribute("x1", "1.2"),
          h.Attribute("x2", "100%"),
          h.Attribute("y1", "1.2"),
          h.Attribute("y2", "1.2"),
          h.Class("stroke-border-primary"),
          h.Stroke("black"),
          h.StrokeDasharray("0,6"),
          h.StrokeLinecap("round"),
          h.StrokeWidth("2.4"),
        ]),
      ],
    );
  }
  const connectorClass =
    type === "featured-icon"
      ? item.status === "complete"
        ? "border-fg-secondary"
        : "border-border-secondary"
      : statusClasses[item.status].connector;
  return h.span([
    h.AriaHidden(true),
    h.Class(`absolute top-1/2 left-[53%] z-0 w-full -translate-y-1/2 border-t-2 ${connectorClass}`),
  ]);
};

const verticalConnector = <Message>(
  item: ProgressStep,
  size: ProgressStepSize,
  type: ProgressStepType,
  h: HtmlBuilder<Message>,
): Html => {
  if (type === "number") {
    return h.div(
      [
        h.AriaHidden(true),
        h.Class(
          `relative flex h-full w-full justify-center self-center overflow-hidden ${size === "sm" ? "my-1" : "my-1.5"} ${item.status === "current" ? "opacity-60" : ""}`,
        ),
      ],
      [
        h.svg(
          [h.Class("absolute"), h.Attribute("width", "3")],
          [
            h.line([
              h.Attribute("x1", "1.2"),
              h.Attribute("x2", "1.2"),
              h.Attribute("y1", "1.2"),
              h.Attribute("y2", "100%"),
              h.Class("stroke-border-primary"),
              h.Stroke("black"),
              h.StrokeDasharray("0,6"),
              h.StrokeLinecap("round"),
              h.StrokeWidth("2.4"),
            ]),
          ],
        ),
      ],
    );
  }
  return h.span([
    h.AriaHidden(true),
    h.Class(
      `${size === "sm" ? "my-1" : "my-1.5"} flex-1 border-l-2 ${type === "featured-icon" ? "border-border-secondary" : statusClasses[item.status].connector}`,
    ),
  ]);
};

const horizontalStep = <Message>(
  item: ProgressStep,
  index: number,
  props: Required<Pick<ProgressStepsProps, "connector" | "size" | "type">>,
  h: HtmlBuilder<Message>,
): Html =>
  h.li(
    [
      ...(item.status === "current" ? [h.AriaCurrent("step")] : []),
      h.Class(
        `flex w-full flex-col items-center justify-center ${props.size === "sm" ? "gap-3" : "gap-4"}`,
      ),
    ],
    [
      h.div(
        [h.Class("relative flex w-full flex-col items-center self-stretch")],
        [
          iconOnly(item, props.size, props.type, index + 1, h),
          ...(props.connector ? [horizontalConnector(item, props.type, h)] : []),
        ],
      ),
      text(item, props.size, true, props.type !== "icon", h),
    ],
  );

const verticalStep = <Message>(
  item: ProgressStep,
  index: number,
  isLast: boolean,
  props: Required<Pick<ProgressStepsProps, "connector" | "size" | "type">>,
  h: HtmlBuilder<Message>,
): Html =>
  h.li(
    [
      ...(item.status === "current" ? [h.AriaCurrent("step")] : []),
      h.Class(
        `flex items-start ${props.size === "sm" ? "gap-3" : "gap-4"} ${props.type === "featured-icon" && item.status !== "current" ? "opacity-60" : ""} ${props.type === "number" && item.status === "incomplete" ? "opacity-60" : ""}`,
      ),
    ],
    [
      h.div(
        [h.Class("flex flex-col items-center self-stretch")],
        [
          iconOnly(item, props.size, props.type, index + 1, h),
          ...(!isLast && props.connector
            ? [verticalConnector(item, props.size, props.type, h)]
            : []),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.size === "sm" ? "pt-0.5" : "pt-1"} ${isLast ? "" : props.size === "sm" ? "pb-6" : "pb-8"}`,
          ),
        ],
        [text(item, props.size, false, props.type !== "icon", h)],
      ),
    ],
  );

const iconsWithText = <Message>(props: ProgressStepsProps, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const type = props.type ?? "icon";
  const orientation = props.orientation ?? "vertical";
  const connector = props.connector ?? true;
  const config = { connector, size, type } as const;
  return h.ol(
    [
      h.AriaLabel("Progress"),
      h.Class(orientation === "horizontal" ? "grid w-full items-start gap-4" : "grid grid-cols-1"),
      ...(orientation === "horizontal"
        ? [
            h.Style({
              "grid-template-columns": `repeat(${String(props.items.length)}, minmax(0, 1fr))`,
            }),
          ]
        : []),
    ],
    props.items.map((item, index) =>
      orientation === "horizontal"
        ? horizontalStep(
            item,
            index,
            { ...config, connector: connector && index !== props.items.length - 1 },
            h,
          )
        : verticalStep(item, index, index === props.items.length - 1, config, h),
    ),
  );
};

const minimal = <Message>(
  props: ProgressStepsProps,
  connected: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  const completed = props.items.filter((item) => item.status === "complete").length;
  return h.div(
    [
      h.AriaLabel("Progress"),
      h.Class(`flex w-full items-center justify-center ${size === "sm" ? "gap-3" : "gap-4"}`),
      h.Role("group"),
    ],
    [
      ...(props.showStepCount === true
        ? [
            h.p(
              [h.Class("text-sm font-medium text-text-secondary")],
              [`Step ${String(completed)} of ${String(props.items.length)}`],
            ),
          ]
        : []),
      ...props.items.flatMap((item, index) => [
        h.span(
          [
            ...(item.status === "current" ? [h.AriaCurrent("step")] : []),
            h.AriaLabel(`${item.title}: ${item.status}`),
          ],
          [iconOnly(item, size, "icon", index + 1, h)],
        ),
        ...(connected && index !== props.items.length - 1
          ? [
              h.span([
                h.AriaHidden(true),
                h.Class(
                  `${props.orientation === "vertical" ? "w-12" : "w-20"} border-t-2 ${statusClasses[item.status].connector}`,
                ),
              ]),
            ]
          : []),
      ]),
    ],
  );
};

const textWithLine = <Message>(props: ProgressStepsProps, h: HtmlBuilder<Message>): Html => {
  const size = props.size ?? "sm";
  const vertical = props.orientation === "vertical";
  return h.ol(
    [
      h.AriaLabel("Progress"),
      h.Class(`grid w-full items-start ${vertical ? "grid-cols-1 gap-5" : "gap-4"}`),
      ...(vertical
        ? []
        : [
            h.Style({
              "grid-template-columns": `repeat(${String(props.items.length)}, minmax(0, 1fr))`,
            }),
          ]),
    ],
    props.items.map((item) =>
      h.li(
        [
          ...(item.status === "current" ? [h.AriaCurrent("step")] : []),
          h.Class(`relative flex w-full flex-col ${size === "sm" ? "pt-3" : "pt-4"}`),
        ],
        [
          h.span([
            h.AriaHidden(true),
            h.Class(
              `absolute inset-x-0 top-0 h-1 ${item.status === "incomplete" ? "bg-bg-quaternary" : "bg-fg-brand-primary-alt"}`,
            ),
          ]),
          text(item, size, false, false, h),
        ],
      ),
    ),
  );
};

export const progressSteps = <Message>(
  props: ProgressStepsProps,
  h: HtmlBuilder<Message>,
): Html => {
  const variant = props.variant ?? "icons-with-text";
  if (variant === "minimal-icons") {
    return minimal(props, false, h);
  }
  if (variant === "minimal-icons-connected") {
    return minimal(props, true, h);
  }
  if (variant === "text-with-line") {
    return textWithLine(props, h);
  }
  return iconsWithText(props, h);
};
