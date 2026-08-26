/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI countdown banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerCountdownDefaultUnit {
  readonly label: string;
  readonly value: number;
}

export interface BannerCountdownDefaultProps<Message> {
  readonly countdown: readonly [
    BannerCountdownDefaultUnit,
    BannerCountdownDefaultUnit,
    BannerCountdownDefaultUnit,
  ];
  readonly description: string;
  readonly dismissLabel: string;
  readonly onDismiss: NoInfer<Message>;
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
        h.StrokeWidth("2"),
      ]),
    ],
  );

const countdownUnit = <Message>(unit: BannerCountdownDefaultUnit, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex items-center gap-1.5")],
    [
      h.div(
        [
          h.Class(
            "flex min-w-7 items-center justify-center rounded-md bg-bg-primary p-1 shadow-xs ring-1 ring-border-primary ring-inset",
          ),
        ],
        [
          h.p(
            [h.Class("min-w-0 flex-1 text-center text-xs font-medium text-text-primary")],
            [String(unit.value)],
          ),
        ],
      ),
      h.p([h.Class("text-sm text-text-tertiary")], [unit.label]),
    ],
  );

export const bannerCountdownDefault = <Message>(
  props: BannerCountdownDefaultProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative mx-2 mb-4 flex flex-col gap-3 rounded-xl bg-bg-secondary p-4 shadow-lg ring-1 ring-border-secondary-alt md:m-0 md:flex-row md:items-center md:justify-center md:px-12 md:py-3",
      ),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [h.Class("flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2")],
        [
          h.p([h.Class("pr-8 text-sm font-semibold text-text-secondary md:pr-0")], [props.title]),
          h.hr([
            h.AriaHidden(true),
            h.Class("hidden h-4 w-px border-none bg-border-secondary md:block"),
          ]),
          h.p([h.Class("text-sm text-text-tertiary")], [props.description]),
        ],
      ),
      h.div(
        [h.Class("flex items-center gap-2"), h.AriaLabel("Time remaining")],
        props.countdown.map((unit) => countdownUnit(unit, h)),
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
  );
