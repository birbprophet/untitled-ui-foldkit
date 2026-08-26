/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match -- The authenticated alert source has two direct anatomies and a closed semantic-color table. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type AlertColor = "default" | "brand" | "gray" | "error" | "warning" | "success";

export interface AlertProps<Message> {
  readonly actionType?: "button" | "link";
  readonly color?: AlertColor;
  readonly confirmLabel: string;
  readonly confirmMessage?: NoInfer<Message>;
  readonly description: string;
  readonly dismissLabel?: string;
  readonly dismissMessage?: NoInfer<Message>;
  readonly title: string;
  readonly variant?: "floating" | "full-width";
}

const alertIcon = <Message>(color: AlertColor, h: HtmlBuilder<Message>): Html => {
  const path =
    color === "success"
      ? "m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
      : color === "error" || color === "warning"
        ? "M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
        : "M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z";
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("z-1 size-5"),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
};

const iconColor: Record<Exclude<AlertColor, "default">, string> = {
  brand: "text-fg-brand-primary before:border-fg-brand-primary/30 after:border-fg-brand-primary/10",
  error: "text-fg-error-primary before:border-fg-error-primary/30 after:border-fg-error-primary/10",
  gray: "text-fg-tertiary before:border-fg-tertiary/30 after:border-fg-tertiary/10",
  success:
    "text-fg-success-primary before:border-fg-success-primary/30 after:border-fg-success-primary/10",
  warning:
    "text-fg-warning-primary before:border-fg-warning-primary/30 after:border-fg-warning-primary/10",
};

const featuredIcon = <Message>(color: AlertColor, h: HtmlBuilder<Message>): Html =>
  color === "default"
    ? h.div(
        [
          h.Class(
            "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
          ),
        ],
        [alertIcon(color, h)],
      )
    : h.div(
        [
          h.Class(
            `relative flex size-5 shrink-0 items-center justify-center before:absolute before:size-7 before:rounded-full before:border-2 after:absolute after:size-9.5 after:rounded-full after:border-2 ${iconColor[color]}`,
          ),
        ],
        [alertIcon(color, h)],
      );

const closeButton = <Message>(label: string, message: Message, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Class("size-5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 24 24")],
        [
          h.path([
            h.D("M17 7 7 17M7 7l10 10"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeLinejoin("round"),
            h.StrokeWidth("2"),
          ]),
        ],
      ),
    ],
  );

const actions = <Message>(props: AlertProps<Message>, h: HtmlBuilder<Message>): readonly Html[] => {
  const dismissLabel = props.dismissLabel ?? "Dismiss";
  const actionType = props.actionType ?? "button";
  return [
    ...(props.dismissMessage === undefined
      ? []
      : [
          button(
            {
              color: actionType === "button" ? "secondary" : "link-gray",
              label: dismissLabel,
              onPress: props.dismissMessage,
              size: "sm",
            },
            h,
          ),
        ]),
    ...(props.confirmMessage === undefined
      ? []
      : [
          button(
            {
              color: actionType === "button" ? "primary" : "link-color",
              label: props.confirmLabel,
              onPress: props.confirmMessage,
              size: "sm",
            },
            h,
          ),
        ]),
  ];
};

export const alert = <Message>(props: AlertProps<Message>, h: HtmlBuilder<Message>): Html => {
  const color = props.color ?? "default";
  const dismissLabel = props.dismissLabel ?? "Dismiss";
  const fullWidth = props.variant === "full-width";
  const actionItems = actions(props, h);
  const copy = h.div(
    [
      h.Class(
        fullWidth
          ? "flex flex-col gap-0.5 overflow-hidden lg:flex-row lg:gap-1.5"
          : "flex flex-col gap-1 overflow-auto",
      ),
    ],
    [
      h.p(
        [h.Class("pr-8 text-sm font-semibold text-text-secondary md:truncate md:pr-0")],
        [props.title],
      ),
      h.p([h.Class("text-sm text-text-tertiary md:truncate")], [props.description]),
    ],
  );
  if (!fullWidth) {
    return h.div(
      [
        h.Class(
          "relative flex flex-col gap-4 rounded-xl border border-border-primary bg-bg-primary-alt p-4 shadow-xs md:flex-row",
        ),
      ],
      [
        featuredIcon(color, h),
        h.div(
          [h.Class("flex flex-1 flex-col gap-3 md:w-0")],
          [
            copy,
            ...(actionItems.length === 0 ? [] : [h.div([h.Class("flex gap-3")], actionItems)]),
          ],
        ),
        ...(props.dismissMessage === undefined
          ? []
          : [
              h.div(
                [h.Class("absolute top-2 right-2")],
                [closeButton(dismissLabel, props.dismissMessage, h)],
              ),
            ]),
      ],
    );
  }
  return h.div(
    [h.Class("relative border-t border-border-primary bg-bg-secondary md:border-t-0 md:border-b")],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-4 p-4 md:flex-row md:items-center md:gap-3 md:px-8 md:py-3",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-1 flex-col gap-4 md:w-0 md:flex-row md:items-center")],
            [h.div([h.Class("hidden md:flex")], [featuredIcon(color, h)]), copy],
          ),
          ...(actionItems.length === 0
            ? []
            : [
                h.div(
                  [h.Class("flex gap-2")],
                  [
                    h.div(
                      [
                        h.Class(
                          `flex w-full gap-3 ${(props.actionType ?? "button") === "button" ? "flex-col-reverse md:flex-row" : "flex-row"}`,
                        ),
                      ],
                      actionItems,
                    ),
                    ...(props.dismissMessage === undefined
                      ? []
                      : [
                          h.div(
                            [h.Class("absolute top-2 right-2 shrink-0 md:static")],
                            [closeButton(dismissLabel, props.dismissMessage, h)],
                          ),
                        ]),
                  ],
                ),
              ]),
        ],
      ),
    ],
  );
};
