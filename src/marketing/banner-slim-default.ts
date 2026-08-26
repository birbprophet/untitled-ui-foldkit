/* oxlint-disable effect/noReturnInArrow -- The renderer is a direct FoldKit transcription of the authenticated Untitled UI banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerSlimDefaultProps<Message> {
  readonly description: string;
  readonly dismissLabel: string;
  readonly linkHref: string;
  readonly linkLabel: string;
  readonly onDismiss: NoInfer<Message>;
  readonly onLink: NoInfer<Message>;
  readonly title: string;
}

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const bannerSlimDefault = <Message>(
  props: BannerSlimDefaultProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative mx-2 mb-4 flex items-center gap-4 rounded-xl bg-bg-secondary p-4 shadow-lg ring-1 ring-border-secondary md:m-0 md:gap-3 md:px-12 md:py-4",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "flex w-0 flex-1 flex-col gap-0.5 md:flex-row md:justify-center md:gap-1.5 md:text-center",
          ),
        ],
        [
          h.p(
            [h.Class("pr-8 text-sm font-semibold text-text-secondary md:truncate md:pr-0")],
            [props.title],
          ),
          h.p(
            [h.Class("text-sm text-text-tertiary md:truncate")],
            [
              `${props.description} `,
              h.a(
                [
                  h.Class(
                    "rounded-xs underline decoration-utility-neutral-300 underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(props.linkHref),
                  h.OnClick(props.onLink),
                ],
                [props.linkLabel],
              ),
              ".",
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("absolute top-2 right-2 flex shrink-0 items-center justify-center")],
        [
          h.button(
            [
              h.AriaLabel(props.dismissLabel),
              h.Class(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(props.onDismiss),
              h.Type("button"),
            ],
            [closeIcon(h)],
          ),
        ],
      ),
    ],
  );
