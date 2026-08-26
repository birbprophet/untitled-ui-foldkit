/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI full-width brand countdown banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerCountdownBrandFullWidthProps<Message> {
  readonly description: string;
  readonly dismissLabel: string;
  readonly hours: number;
  readonly hoursLabel: string;
  readonly minutes: number;
  readonly minutesLabel: string;
  readonly onDismiss: NoInfer<Message>;
  readonly seconds: number;
  readonly secondsLabel: string;
  readonly title: string;
}

const countdownUnit = <Message>(
  countdownValue: number,
  unitLabel: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex items-center gap-1.5")],
    [
      h.div(
        [
          h.Class(
            "flex min-w-7 items-center justify-center rounded-md p-1 ring-1 ring-utility-brand-500_alt ring-inset",
          ),
        ],
        [
          h.p(
            [h.Class("min-w-0 flex-1 text-center text-xs font-medium text-primary_on-brand")],
            [String(countdownValue)],
          ),
        ],
      ),
      h.p([h.Class("text-sm text-tertiary_on-brand")], [unitLabel]),
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

export const bannerCountdownBrandFullWidth = <Message>(
  props: BannerCountdownBrandFullWidthProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative border-t border-brand_alt bg-brand-section_subtle in-data-[theme=dark]:border-neutral-700 md:border-t-0 md:border-b md:border-brand md:in-data-[theme=dark]:border-neutral-700",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-3 p-4 md:flex-row md:items-center md:justify-center md:px-12 md:py-3",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2")],
            [
              h.p(
                [h.Class("pr-8 text-sm font-semibold text-primary_on-brand md:pr-0")],
                [props.title],
              ),
              h.hr([h.Class("hidden h-4 w-px border-none bg-white/20 md:block")]),
              h.p([h.Class("text-sm text-tertiary_on-brand")], [props.description]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-2")],
            [
              countdownUnit(props.hours, props.hoursLabel, h),
              countdownUnit(props.minutes, props.minutesLabel, h),
              countdownUnit(props.seconds, props.secondsLabel, h),
            ],
          ),
          h.div(
            [
              h.Class(
                "absolute top-2 right-2 flex shrink-0 items-center justify-center md:top-1/2 md:-translate-y-1/2",
              ),
            ],
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
      ),
    ],
  );
