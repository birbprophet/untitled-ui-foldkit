/* oxlint-disable effect/noReturnInArrow -- The renderer is a direct FoldKit transcription of the authenticated Untitled UI brand banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerSlimBrandProps<Message> {
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

export const bannerSlimBrand = <Message>(
  props: BannerSlimBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative mx-2 mb-4 flex items-center gap-4 rounded-xl border-t border-brand_alt bg-brand-section_subtle p-4 shadow-lg in-data-[theme=dark]:border-neutral-700 md:m-0 md:gap-3 md:border-t-0 md:border-b md:border-brand md:px-12 md:py-4 md:in-data-[theme=dark]:border-neutral-700",
      ),
      h.Dir("ltr"),
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
      h.div(
        [h.Class("absolute top-2 right-2 flex shrink-0 items-center justify-center")],
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
