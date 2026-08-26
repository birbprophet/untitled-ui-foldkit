/* oxlint-disable effect/noReturnInArrow -- The renderer is a direct FoldKit transcription of the authenticated Untitled UI banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerSlimBrandFullWidthProps<Message> {
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
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

export const bannerSlimBrandFullWidth = <Message>(
  props: BannerSlimBrandFullWidthProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative border-b border-brand_alt bg-bg-brand-section_subtle in-data-[theme=dark]:border-neutral-700 md:border-brand md:in-data-[theme=dark]:border-neutral-700",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class("p-4 md:py-3.5")],
        [
          h.div(
            [
              h.Class(
                "flex flex-col gap-0.5 md:flex-row md:justify-center md:gap-1.5 md:text-center",
              ),
            ],
            [
              h.p(
                [h.Class("pr-8 text-sm font-semibold text-primary_on-brand md:truncate md:pr-0")],
                [props.title],
              ),
              h.p(
                [h.Class("text-sm text-tertiary_on-brand md:truncate")],
                [
                  `${props.description} `,
                  h.a(
                    [
                      h.Class(
                        "rounded-xs underline decoration-utility-brand-500_alt underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
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
        ],
      ),
      h.div(
        [h.Class("absolute top-2 right-2 md:top-1.5")],
        [
          h.button(
            [
              h.AriaLabel(props.dismissLabel),
              h.Class(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring transition duration-100 ease-linear hover:bg-white/20 hover:text-fg-white focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
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
