/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Exact upstream SVG branches and optional label content remain direct. */
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

export interface LoadingIndicatorProps {
  readonly label?: string;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly type?: "line-simple" | "line-spinner" | "dot-circle";
}

const sizeClasses = {
  lg: { label: "text-lg", root: "gap-4", spinner: "size-14" },
  md: { label: "text-sm", root: "gap-4", spinner: "size-12" },
  sm: { label: "text-sm", root: "gap-4", spinner: "size-8" },
  xl: { label: "text-lg", root: "gap-5", spinner: "size-16" },
} as const;

const circle = <Message>(
  className: string,
  attributes: readonly Attribute<Message>[],
  h: HtmlBuilder<Message>,
): Html => h.circle([h.Class(className), ...attributes]);

const lineSpinner = <Message>(
  type: NonNullable<LoadingIndicatorProps["type"]>,
  spinner: string,
  h: HtmlBuilder<Message>,
): Html => {
  if (type === "dot-circle") {
    return h.svg(
      [
        h.AriaHidden(true),
        h.Class(`animate-spin motion-reduce:animate-none text-fg-brand-primary ${spinner}`),
        h.Fill("none"),
        h.ViewBox("0 0 36 36"),
      ],
      [
        h.path([
          h.D(
            "M34 18C34 15.8989 33.5861 13.8183 32.7821 11.8771C31.978 9.93586 30.7994 8.17203 29.3137 6.68629C27.828 5.20055 26.0641 4.022 24.1229 3.21793C22.1817 2.41385 20.1011 2 18 2C15.8988 2 13.8183 2.41385 11.8771 3.21793C9.93585 4.022 8.17203 5.20055 6.68629 6.68629C5.20055 8.17203 4.022 9.93586 3.21793 11.8771C2.41385 13.8183 2 15.8989 2 18",
          ),
          h.Stroke("url(#loading-dot-top)"),
          h.StrokeWidth("4"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeDasharray("0.1 8"),
        ]),
        h.path([
          h.D(
            "M3.21793 24.1229C4.022 26.0641 5.20055 27.828 6.68629 29.3137C8.17203 30.7994 9.93585 31.978 11.8771 32.7821C13.8183 33.5861 15.8988 34 18 34C20.1011 34 22.1817 33.5861 24.1229 32.7821C26.0641 31.978 27.828 30.7994 29.3137 29.3137C30.7994 27.828 31.978 26.0641 32.7821 24.1229",
          ),
          h.Stroke("url(#loading-dot-bottom)"),
          h.StrokeWidth("4"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeDasharray("0.1 8"),
        ]),
        h.defs(
          [],
          [
            h.linearGradient(
              [
                h.Id("loading-dot-top"),
                h.X1("34"),
                h.Y1("18"),
                h.X2("2"),
                h.Y2("18"),
                h.Attribute("gradientUnits", "userSpaceOnUse"),
              ],
              [
                h.stop([h.StopColor("currentColor")]),
                h.stop([h.Offset("1"), h.StopColor("currentColor"), h.StopOpacity("0.5")]),
              ],
            ),
            h.linearGradient(
              [
                h.Id("loading-dot-bottom"),
                h.X1("33"),
                h.Y1("23.5"),
                h.X2("3"),
                h.Y2("24"),
                h.Attribute("gradientUnits", "userSpaceOnUse"),
              ],
              [
                h.stop([h.StopColor("currentColor"), h.StopOpacity("0")]),
                h.stop([h.Offset("1"), h.StopColor("currentColor"), h.StopOpacity("0.48")]),
              ],
            ),
          ],
        ),
      ],
    );
  }
  const foreground = circle(
    "stroke-fg-brand-primary",
    [
      h.Attribute("cx", "16"),
      h.Attribute("cy", "16"),
      h.Attribute("r", "14"),
      h.Fill("none"),
      h.StrokeWidth("4"),
      h.StrokeDashoffset(type === "line-spinner" ? "40" : "75"),
      h.StrokeDasharray("100"),
      h.StrokeLinecap("round"),
    ],
    h,
  );
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(`animate-spin motion-reduce:animate-none ${spinner}`),
      h.Fill("none"),
      h.ViewBox("0 0 32 32"),
    ],
    type === "line-simple"
      ? [
          circle(
            "text-bg-tertiary",
            [
              h.Attribute("cx", "16"),
              h.Attribute("cy", "16"),
              h.Attribute("r", "14"),
              h.Stroke("currentColor"),
              h.StrokeWidth("4"),
            ],
            h,
          ),
          foreground,
        ]
      : [foreground],
  );
};

export const loadingIndicator = <Message>(
  props: LoadingIndicatorProps,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "sm";
  const type = props.type ?? "line-simple";
  const classes = sizeClasses[size];
  return h.div(
    [
      h.Class(`flex flex-col items-center justify-center ${classes.root}`),
      h.Role("status"),
      h.AriaLabel(props.label ?? "Loading"),
    ],
    [
      lineSpinner(type, classes.spinner, h),
      ...(props.label === undefined
        ? []
        : [h.span([h.Class(`${classes.label} font-medium text-text-secondary`)], [props.label])]),
    ],
  );
};
