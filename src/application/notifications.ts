/* oxlint-disable effect/noReturnInArrow, effect/noTernary, effect/noSpread, eslint/no-nested-ternary -- The three upstream notification anatomies form one closed discriminated renderer. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

type NotificationColor = "default" | "brand" | "gray" | "error" | "warning" | "success";

interface NotificationActions<Message> {
  readonly confirmLabel?: string;
  readonly dismissLabel?: string;
  readonly hideDismissLabel?: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onConfirm?: NoInfer<Message>;
}

export type NotificationProps<Message> =
  | (NotificationActions<Message> &
      Readonly<{
        color?: NotificationColor;
        description: string;
        kind: "icon";
        progress?: number;
        title: string;
      }>)
  | (NotificationActions<Message> &
      Readonly<{ avatar: string; content: string; date: string; kind: "avatar"; name: string }>)
  | (NotificationActions<Message> &
      Readonly<{
        description: string;
        imageDesktop: string;
        imageMobile: string;
        kind: "image";
        title: string;
      }>);

const closeIcon = <Message>(message: NoInfer<Message>, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.AriaLabel("Dismiss"),
      h.Class(
        "absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
        [
          h.path([
            h.D("m5 5 10 10M15 5 5 15"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeWidth("1.67"),
          ]),
        ],
      ),
    ],
  );

const actions = <Message>(props: NotificationActions<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex gap-3")],
    [
      ...(props.hideDismissLabel === true
        ? []
        : [
            button(
              {
                color: "link-gray",
                label: props.dismissLabel ?? "Dismiss",
                onPress: props.onClose,
                size: "sm",
              },
              h,
            ),
          ]),
      ...(props.confirmLabel === undefined || props.onConfirm === undefined
        ? []
        : [
            button(
              {
                color: "link-color",
                label: props.confirmLabel,
                onPress: props.onConfirm,
                size: "sm",
              },
              h,
            ),
          ]),
    ],
  );

const featuredIcon = <Message>(color: NotificationColor, h: HtmlBuilder<Message>): Html => {
  const semantic = color === "default" ? "gray" : color;
  const classes =
    semantic === "gray"
      ? "size-10 rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset"
      : semantic === "error"
        ? "text-text-error-primary before:border-text-error-primary/30 after:border-text-error-primary/10"
        : semantic === "warning"
          ? "text-text-warning-primary before:border-text-warning-primary/30 after:border-text-warning-primary/10"
          : semantic === "success"
            ? "text-text-success-primary before:border-text-success-primary/30 after:border-text-success-primary/10"
            : "text-fg-brand-primary before:border-fg-brand-primary/30 after:border-fg-brand-primary/10";
  const anatomy =
    semantic === "gray"
      ? ""
      : "relative size-5 before:absolute before:size-7 before:rounded-full before:border-2 after:absolute after:size-9.5 after:rounded-full after:border-2";
  return h.span(
    [
      h.AriaHidden(true),
      h.Class(`flex shrink-0 items-center justify-center ${anatomy} ${classes}`),
    ],
    [
      h.svg(
        [h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 20 20")],
        [
          h.circle([
            h.Cx("10"),
            h.Cy("10"),
            h.R("7.5"),
            h.Stroke("currentColor"),
            h.StrokeWidth("1.67"),
          ]),
          h.path([
            h.D(color === "success" ? "m6.8 10 2 2 4.4-4.5" : "M10 9v4m0-7h.01"),
            h.Stroke("currentColor"),
            h.StrokeLinecap("round"),
            h.StrokeWidth("1.67"),
          ]),
        ],
      ),
    ],
  );
};

const uploadProgress = <Message>(percentage: number, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex flex-col items-end gap-2")],
    [
      h.div(
        [
          h.AriaValuemax(100),
          h.AriaValuemin(0),
          h.AriaValuenow(percentage),
          h.Class("h-2 w-full overflow-hidden rounded-md bg-bg-quaternary"),
          h.Role("progressbar"),
        ],
        [
          h.div([
            h.Class("size-full rounded-md bg-fg-brand-primary"),
            h.Style({ transform: `translateX(-${String(100 - percentage)}%)` }),
          ]),
        ],
      ),
      h.span(
        [h.Class("text-sm font-medium text-text-secondary tabular-nums")],
        [`${String(percentage)}% uploaded...`],
      ),
    ],
  );

const iconNotification = <Message>(
  props: Extract<NotificationProps<Message>, { kind: "icon" }>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative z-[var(--z-index)] flex max-w-full flex-col gap-4 rounded-xl bg-bg-primary-alt p-4 shadow-lg ring-1 ring-border-secondary-alt xs:w-[var(--width)] xs:flex-row",
      ),
    ],
    [
      featuredIcon(props.color ?? "default", h),
      h.div(
        [
          h.Class(
            `flex flex-1 flex-col gap-3 md:pr-8 ${props.color !== undefined && props.color !== "default" ? "md:pt-0.5" : ""} ${props.progress === undefined ? "" : "gap-4"}`,
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.p([h.Class("text-sm font-semibold text-fg-primary")], [props.title]),
              h.p([h.Class("text-sm text-fg-secondary")], [props.description]),
            ],
          ),
          ...(props.progress === undefined ? [] : [uploadProgress(props.progress, h)]),
          actions(props, h),
        ],
      ),
      closeIcon(props.onClose, h),
    ],
  );

const avatarNotification = <Message>(
  props: Extract<NotificationProps<Message>, { kind: "avatar" }>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative z-[var(--z-index)] flex max-w-full flex-col items-start gap-4 rounded-xl bg-bg-primary-alt p-4 shadow-lg ring-1 ring-border-secondary-alt xs:w-[var(--width)] xs:flex-row",
      ),
    ],
    [
      avatar({ alt: props.name, size: "md", src: props.avatar, status: "online" }, h),
      h.div(
        [h.Class("flex flex-col gap-3 pr-8")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.div(
                [h.Class("flex items-center gap-2")],
                [
                  h.p([h.Class("text-sm font-semibold text-fg-primary")], [props.name]),
                  h.span([h.Class("text-sm text-fg-quaternary")], [props.date]),
                ],
              ),
              h.p([h.Class("text-sm text-fg-secondary")], [props.content]),
            ],
          ),
          actions(props, h),
        ],
      ),
      closeIcon(props.onClose, h),
    ],
  );

const imageNotification = <Message>(
  props: Extract<NotificationProps<Message>, { kind: "image" }>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative z-[var(--z-index)] flex max-w-full flex-col gap-3 rounded-xl bg-bg-primary-alt p-4 shadow-lg max-md:ring-1 max-md:ring-border-secondary-alt xs:w-[496px] xs:flex-row xs:gap-0 md:p-0",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "-my-px hidden w-40 shrink-0 overflow-hidden rounded-l-xl outline-1 -outline-offset-1 outline-black/10 md:block",
          ),
        ],
        [
          h.img([
            h.AriaHidden(true),
            h.Alt(""),
            h.Class("size-full object-cover"),
            h.Src(props.imageMobile),
          ]),
        ],
      ),
      h.div(
        [
          h.Class(
            "flex flex-col gap-4 rounded-r-xl bg-bg-primary-alt md:gap-3 md:p-4 md:pl-5 md:ring-1 md:ring-border-secondary-alt",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-1 pr-8")],
            [
              h.p([h.Class("text-sm font-semibold text-fg-primary")], [props.title]),
              h.p([h.Class("text-sm text-fg-secondary")], [props.description]),
            ],
          ),
          h.div(
            [h.Class("h-40 w-full overflow-hidden rounded-md bg-bg-secondary md:hidden")],
            [
              h.img([
                h.Alt("Image Desktop"),
                h.Class("size-full object-cover"),
                h.Src(props.imageDesktop),
              ]),
            ],
          ),
          actions(props, h),
        ],
      ),
      closeIcon(props.onClose, h),
    ],
  );

export const notification = <Message>(
  props: NotificationProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  props.kind === "icon"
    ? iconNotification(props, h)
    : props.kind === "avatar"
      ? avatarNotification(props, h)
      : imageNotification(props, h);
