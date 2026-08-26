/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The authenticated metric family has nine explicit anatomies and closed variant tables. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type MetricChangeType = "simple" | "trend" | "modern";
export type MetricTrend = "positive" | "negative";
type MetricChartVariant = "chart-01" | "chart-02" | "chart-03" | "chart-04";
export type MetricVariant =
  | "simple"
  | "icon-01"
  | "icon-02"
  | "icon-03"
  | "icon-04"
  | "chart-01"
  | "chart-02"
  | "chart-03"
  | "chart-04";

export interface MetricsProps<Message> {
  readonly actionsOpen?: boolean;
  readonly change?: string;
  readonly changeDescription?: string;
  readonly changeType?: MetricChangeType;
  readonly footerLabel?: string;
  readonly footerMessage?: NoInfer<Message>;
  readonly onAction?: (action: "copy" | "share" | "view") => Message;
  readonly onActionsToggle?: NoInfer<Message>;
  readonly showActions?: boolean;
  readonly subtitle?: string;
  readonly title?: string;
  readonly trend?: MetricTrend;
  readonly variant?: MetricVariant;
}

const icon = <Message>(
  kind: "dots" | "eye" | "share" | "copy" | "trend" | "zap",
  h: HtmlBuilder<Message>,
  className = "size-5",
): Html => {
  const paths = {
    copy: "M8 8V5.6A1.6 1.6 0 0 1 9.6 4h8.8A1.6 1.6 0 0 1 20 5.6v8.8a1.6 1.6 0 0 1-1.6 1.6H16M5.6 8h8.8A1.6 1.6 0 0 1 16 9.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.4V9.6A1.6 1.6 0 0 1 5.6 8Z",
    dots: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    eye: "M2.42 12.71a1.72 1.72 0 0 1 0-1.42C3.64 8.53 6.78 4 12 4s8.36 4.53 9.58 7.29c.2.45.2.97 0 1.42C20.36 15.47 17.22 20 12 20S3.64 15.47 2.42 12.71ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    share:
      "M8.59 13.51 15.42 17.5M15.41 6.5 8.59 10.49M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    trend: "m4 17 6-6 4 4 6-7m0 0h-5m5 0v5",
    zap: "m13 2-9 12h8l-1 8 9-12h-8l1-8Z",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

const changeArrow = <Message>(
  type: MetricChangeType,
  trend: MetricTrend,
  h: HtmlBuilder<Message>,
): Html => {
  const positive = trend === "positive";
  const path =
    type === "trend"
      ? positive
        ? "m3 17 6-6 4 4 8-8m0 0h-6m6 0v6"
        : "m3 7 6 6 4-4 8 8m0 0h-6m6 0v-6"
      : positive
        ? type === "modern"
          ? "M7 17 17 7m0 0H7m10 0v10"
          : "m12 19V5m0 0-6 6m6-6 6 6"
        : type === "modern"
          ? "m7 7 10 10m0 0V7m0 10H7"
          : "M12 5v14m0 0 6-6m-6 6-6-6";
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(`${type === "modern" ? "size-3" : "size-4"} stroke-[3px]`),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
      ]),
    ],
  );
};

const changeIndicator = <Message>(
  type: MetricChangeType,
  trend: MetricTrend,
  metricChange: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `flex items-center ${type === "simple" ? "gap-0.5" : "gap-1"} ${type === "modern" ? "rounded-md bg-bg-primary py-0.5 pr-2 pl-1.5 shadow-xs ring-1 ring-border-primary ring-inset" : ""} ${trend === "negative" ? "text-fg-error-secondary" : "text-fg-success-secondary"}`,
      ),
    ],
    [
      changeArrow(type, trend, h),
      h.span(
        [
          h.Class(
            `text-sm font-medium ${type === "modern" ? "text-text-secondary" : trend === "negative" ? "text-text-error-primary" : "text-text-success-primary"}`,
          ),
        ],
        [metricChange],
      ),
    ],
  );

const featuredIcon = <Message>(
  kind: "brand" | "gray" | "success",
  size: "md" | "lg",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `flex shrink-0 items-center justify-center ${size === "md" ? "size-10 rounded-lg" : "size-12 rounded-[10px]"} ${kind === "gray" ? "bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset" : kind === "brand" ? "bg-bg-brand-primary text-fg-brand-secondary" : "bg-bg-success-primary text-fg-success-secondary"}`,
      ),
    ],
    [icon(kind === "brand" ? "zap" : "trend", h, size === "md" ? "size-5" : "size-6")],
  );

const actions = <Message>(props: MetricsProps<Message>, h: HtmlBuilder<Message>): Html => {
  const action = props.onAction;
  const items = [
    ["view", "View more", "eye"],
    ["share", "Share", "share"],
    ["copy", "Copy link", "copy"],
  ] as const;
  return h.div(
    [h.Class("absolute top-4 right-4 md:top-5 md:right-5")],
    [
      h.button(
        [
          h.AriaExpanded(props.actionsOpen === true),
          h.AriaHasPopup("menu"),
          h.AriaLabel("Metric actions"),
          h.Class(
            `flex size-5 items-center justify-center rounded text-fg-quaternary outline-focus-ring hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${props.actionsOpen === true ? "outline-2 outline-offset-2" : ""}`,
          ),
          ...(props.onActionsToggle === undefined ? [] : [h.OnClick(props.onActionsToggle)]),
          h.Type("button"),
        ],
        [icon("dots", h)],
      ),
      ...(props.actionsOpen === true
        ? [
            h.div(
              [
                h.Class(
                  "absolute top-7 right-0 z-20 w-36 rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary outline-none",
                ),
                h.Autofocus(true),
                h.Attribute("tabindex", "-1"),
                h.Role("menu"),
              ],
              items.map(([id, label, iconName]) =>
                h.button(
                  [
                    h.Class(
                      "group block w-full cursor-pointer px-1.5 py-px text-left outline-none",
                    ),
                    h.Role("menuitem"),
                    ...(action === undefined ? [] : [h.OnClick(action(id))]),
                    h.Type("button"),
                  ],
                  [
                    h.div(
                      [
                        h.Class(
                          `flex items-center rounded-md px-2.5 py-2 text-sm font-semibold text-text-secondary outline-focus-ring group-hover:bg-bg-primary-hover ${id === "view" ? "outline-2 outline-offset-[-2px]" : ""}`,
                        ),
                      ],
                      [
                        h.span([h.Class("mr-2")], [icon(iconName, h, "size-4")]),
                        h.span([h.Class("grow pr-4")], [label]),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ]
        : []),
    ],
  );
};

const footer = <Message>(
  props: MetricsProps<Message>,
  h: HtmlBuilder<Message>,
  className = "flex items-center justify-end border-t border-border-secondary p-4 md:px-5",
): readonly Html[] =>
  props.footerLabel === undefined || props.footerMessage === undefined
    ? []
    : [
        h.div(
          [h.Class(className)],
          [
            button(
              {
                color: "link-color",
                label: props.footerLabel,
                onPress: props.footerMessage,
                size: "sm",
              },
              h,
            ),
          ],
        ),
      ];

const sparkline = <Message>(
  variant: "chart-01" | "chart-02" | "chart-03" | "chart-04",
  trend: MetricTrend,
  h: HtmlBuilder<Message>,
): Html => {
  const large = variant === "chart-03" || variant === "chart-04";
  const path =
    variant === "chart-02"
      ? "M0 44 C20 42 22 8 45 15 S70 40 88 20 S110 2 128 8 L128 56 L0 56Z"
      : large
        ? "M0 70 C80 66 120 28 190 40 S300 62 380 12"
        : "M0 45 C18 42 22 35 35 37 S52 44 64 28 S82 22 94 25 S104 12 112 8";
  const viewBox = large ? "0 0 380 72" : variant === "chart-02" ? "0 0 128 56" : "0 0 112 56";
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `${variant === "chart-03" ? "h-18 w-full" : variant === "chart-04" ? "h-14 w-full" : variant === "chart-02" ? "h-14 w-32" : "h-14 w-28"} ${trend === "negative" ? "text-fg-error-secondary" : "text-fg-success-secondary"}`,
      ),
      h.Fill("none"),
      h.PreserveAspectRatio("none"),
      h.ViewBox(viewBox),
    ],
    [
      h.path([
        h.D(path),
        h.Fill("currentColor"),
        h.FillOpacity(variant === "chart-02" ? "0.12" : "0.08"),
      ]),
      ...(variant === "chart-02"
        ? []
        : [h.path([h.D(path), h.Fill("none"), h.Stroke("currentColor"), h.StrokeWidth("2")])]),
    ],
  );
};

const card = <Message>(
  props: MetricsProps<Message>,
  body: readonly Html[],
  h: HtmlBuilder<Message>,
  secondary = false,
): Html =>
  h.div(
    [
      h.Class(
        `${secondary ? "overflow-hidden bg-bg-secondary" : "bg-bg-primary"} rounded-xl shadow-xs ring-1 ring-border-secondary ring-inset`,
      ),
    ],
    [...body, ...footer(props, h)],
  );

export const metrics = <Message>(props: MetricsProps<Message>, h: HtmlBuilder<Message>): Html => {
  const variant = props.variant ?? "simple";
  const trend = props.trend ?? "positive";
  const change = props.change ?? "100%";
  const title = props.title ?? "2,000";
  const subtitle = props.subtitle ?? "View 24 hours";
  const showActions = props.showActions !== false;
  const menu = showActions ? [actions(props, h)] : [];
  const indicator = (type: MetricChangeType = props.changeType ?? "simple") =>
    changeIndicator(type, trend, change, h);
  if (variant === "simple") {
    return card(
      props,
      [
        h.div(
          [h.Class("relative flex flex-col gap-2 px-4 py-5 md:px-5")],
          [
            h.h3([h.Class("text-sm font-medium text-text-tertiary")], [subtitle]),
            h.div(
              [h.Class("flex items-end gap-4")],
              [
                h.p([h.Class("flex-1 text-display-sm font-semibold text-text-primary")], [title]),
                indicator(),
              ],
            ),
            ...menu,
          ],
        ),
      ],
      h,
    );
  }
  if (variant.startsWith("icon-")) {
    const iconNumber = variant.slice(-2);
    const horizontal = iconNumber === "04";
    const heading = iconNumber === "02";
    const iconColor = iconNumber === "01" ? "success" : iconNumber === "02" ? "brand" : "gray";
    return card(
      props,
      [
        h.div(
          [
            h.Class(
              `relative flex gap-4 px-4 py-5 md:px-5 ${horizontal ? "flex-col md:flex-row" : "flex-col md:gap-5"}`,
            ),
          ],
          [
            ...(heading
              ? [
                  h.div(
                    [h.Class("flex items-center gap-3")],
                    [
                      featuredIcon(iconColor, "lg", h),
                      h.h3([h.Class("text-md font-semibold text-text-primary")], [subtitle]),
                    ],
                  ),
                ]
              : [featuredIcon(iconColor, horizontal ? "md" : "lg", h)]),
            h.div(
              [h.Class(`flex w-full flex-col ${heading ? "gap-3" : "gap-2"}`)],
              [
                ...(heading
                  ? []
                  : [h.h3([h.Class("text-sm font-semibold text-text-tertiary")], [subtitle])]),
                h.div(
                  [
                    h.Class(
                      `flex ${horizontal ? "flex-wrap items-center justify-between" : "items-end"} gap-4`,
                    ),
                  ],
                  [
                    h.p(
                      [h.Class("flex-1 text-display-sm font-semibold text-text-primary")],
                      [title],
                    ),
                    h.div(
                      [h.Class("flex items-center gap-2")],
                      [
                        indicator(
                          iconNumber === "01" || iconNumber === "04"
                            ? "modern"
                            : iconNumber === "03"
                              ? "trend"
                              : "simple",
                        ),
                        ...(iconNumber === "01" || iconNumber === "04"
                          ? []
                          : [
                              h.span(
                                [h.Class("text-sm font-medium text-text-tertiary")],
                                ["vs last month"],
                              ),
                            ]),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            ...menu,
          ],
        ),
      ],
      h,
    );
  }
  const chartVariant: MetricChartVariant =
    variant === "chart-01"
      ? "chart-01"
      : variant === "chart-02"
        ? "chart-02"
        : variant === "chart-03"
          ? "chart-03"
          : "chart-04";
  const full = chartVariant === "chart-03" || chartVariant === "chart-04";
  if (chartVariant === "chart-03") {
    return card(
      props,
      [
        h.div(
          [h.Class("relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5")],
          [
            h.div(
              [h.Class("flex flex-col gap-2")],
              [
                h.h3([h.Class("text-sm font-medium text-text-tertiary")], [subtitle]),
                h.div(
                  [h.Class("flex items-center gap-4")],
                  [
                    h.p(
                      [h.Class("flex-1 text-display-sm font-semibold text-text-primary")],
                      [title],
                    ),
                    h.div(
                      [h.Class("flex gap-2")],
                      [
                        indicator(props.changeType ?? "trend"),
                        h.span(
                          [h.Class("text-sm font-medium text-text-tertiary")],
                          [props.changeDescription ?? "vs last month"],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            sparkline(chartVariant, trend, h),
            ...menu,
          ],
        ),
      ],
      h,
    );
  }
  if (chartVariant === "chart-04") {
    return h.div(
      [
        h.Class(
          "flex flex-col overflow-hidden rounded-xl bg-bg-secondary shadow-xs ring-1 ring-border-secondary ring-inset",
        ),
      ],
      [
        h.div(
          [h.Class("mb-0.5 px-4 pt-3 pb-2 md:px-5")],
          [h.h3([h.Class("text-sm font-semibold text-text-primary")], [subtitle])],
        ),
        h.div(
          [
            h.Class(
              "relative flex flex-col gap-4 rounded-xl bg-bg-primary px-4 py-5 shadow-xs ring-1 ring-border-secondary ring-inset md:gap-5 md:px-5",
            ),
          ],
          [
            h.div(
              [h.Class("flex flex-col gap-2")],
              [
                h.div(
                  [h.Class("flex items-center gap-3")],
                  [
                    h.p([h.Class("text-display-sm font-semibold text-text-primary")], [title]),
                    h.div(
                      [h.Class("flex gap-2")],
                      [
                        indicator(props.changeType ?? "trend"),
                        h.span(
                          [h.Class("text-sm font-medium text-text-tertiary")],
                          [props.changeDescription ?? "vs last month"],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            sparkline(chartVariant, trend, h),
            ...menu,
          ],
        ),
        ...footer(props, h, "flex items-center justify-end py-3 pr-4 pl-3 md:pr-5 md:pl-4"),
      ],
    );
  }
  const metricBody = h.div(
    [h.Class("relative flex flex-col gap-5 px-4 py-5 md:px-5")],
    [
      h.h3([h.Class("text-md font-semibold text-text-primary")], [subtitle]),
      h.div(
        [h.Class(full ? "flex flex-col gap-4" : "flex items-end justify-between gap-4")],
        [
          h.div(
            [h.Class("flex flex-col gap-3")],
            [
              h.p([h.Class("text-display-sm font-semibold text-text-primary")], [title]),
              h.div(
                [h.Class("flex items-center gap-2")],
                [
                  indicator(props.changeType ?? "trend"),
                  ...(chartVariant === "chart-02"
                    ? []
                    : [
                        h.span(
                          [h.Class("text-sm font-medium text-text-tertiary")],
                          [props.changeDescription ?? "vs last month"],
                        ),
                      ]),
                ],
              ),
            ],
          ),
          sparkline(chartVariant, trend, h),
        ],
      ),
      ...menu,
    ],
  );
  return card(props, [metricBody], h);
};
