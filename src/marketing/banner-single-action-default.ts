/* oxlint-disable effect/noReturnInArrow -- This is a direct FoldKit transcription of the authenticated Untitled UI single-action banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerSingleActionDefaultProps<Message> {
  readonly actionHref: string;
  readonly actionLabel: string;
  readonly description: string;
  readonly dismissLabel: string;
  readonly onAction: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly title: string;
}

const starsIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("z-1 size-5 shrink-0 transition-inherit-all"),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 transition-inherit-all"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const bannerSingleActionDefault = <Message>(
  props: BannerSingleActionDefaultProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative mx-0 mb-4 flex flex-col gap-3 rounded-xl bg-bg-secondary p-4 shadow-lg ring-1 ring-border-secondary-alt md:m-0 md:flex-row md:items-center md:p-4",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class("flex flex-1 flex-col gap-3 md:w-0 md:flex-row md:items-center")],
        [
          h.div(
            [
              h.Class(
                "relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset",
              ),
              h.DataAttribute("featured-icon", ""),
            ],
            [starsIcon(h)],
          ),
          h.div(
            [h.Class("flex flex-col gap-0.5 overflow-hidden lg:flex-row lg:gap-1.5")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-text-secondary md:truncate")],
                [props.title],
              ),
              h.p([h.Class("text-sm text-text-tertiary md:truncate")], [props.description]),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-2 md:flex-row")],
        [
          h.a(
            [
              h.Class(
                "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(props.actionHref),
              h.OnClick(props.onAction),
            ],
            [h.span([h.Class("px-0.5")], [props.actionLabel])],
          ),
          h.div(
            [h.Class("absolute top-2 right-2 flex shrink-0 items-center justify-center md:static")],
            [
              h.button(
                [
                  h.AriaLabel(props.dismissLabel),
                  h.Class(
                    "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnClick(props.onDismiss),
                  h.Type("button"),
                ],
                [closeIcon(h)],
              ),
            ],
          ),
        ],
      ),
    ],
  );
