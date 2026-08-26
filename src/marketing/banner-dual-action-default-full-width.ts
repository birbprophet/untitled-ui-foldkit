/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI full-width dual-action banner. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BannerDualActionDefaultFullWidthProps<Message> {
  readonly allowLabel: string;
  readonly declineLabel: string;
  readonly dismissLabel: string;
  readonly onAllow: NoInfer<Message>;
  readonly onDecline: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onPolicy: NoInfer<Message>;
  readonly policyHref: string;
  readonly policyLabel: string;
  readonly policyPrefix: string;
  readonly title: string;
}

const verifiedIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-brand-primary-alt"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          "m9 12 2 2 4.5-4.5m2.401-4.501a2.03 2.03 0 0 0 1.1 1.1l1.744.723a2.033 2.033 0 0 1 1.1 2.656l-.722 1.744a2.03 2.03 0 0 0 0 1.556l.722 1.744a2.033 2.033 0 0 1-1.1 2.656L19 17.901A2.033 2.033 0 0 0 17.9 19l-.723 1.745a2.032 2.032 0 0 1-2.656 1.1l-1.744-.722a2.032 2.032 0 0 0-1.555 0l-1.745.723a2.033 2.033 0 0 1-2.654-1.1L6.1 19.001A2.033 2.033 0 0 0 5 17.9l-1.744-.723a2.033 2.033 0 0 1-1.1-2.654l.721-1.744a2.033 2.033 0 0 0 0-1.556l-.722-1.746a2.033 2.033 0 0 1 1.1-2.657L5 6.098A2.03 2.03 0 0 0 6.1 5l.723-1.745a2.033 2.033 0 0 1 2.656-1.1l1.744.722a2.033 2.033 0 0 0 1.555-.001l1.746-.72a2.032 2.032 0 0 1 2.655 1.1l.723 1.746v-.003Z",
        ),
      ]),
    ],
  );

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const actionButton = <Message>(
  label: string,
  message: Message,
  primary: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        primary
          ? "group relative inline-flex h-max w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-white shadow-xs outline-focus-ring transition duration-100 ease-linear hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:w-auto"
          : "group relative inline-flex h-max w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:w-auto",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    [h.span([h.Class("px-0.5")], [label])],
  );

export const bannerDualActionDefaultFullWidth = <Message>(
  props: BannerDualActionDefaultFullWidthProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class("relative border-t border-border-primary bg-bg-secondary md:border-t-0 md:border-b"),
      h.Dir("ltr"),
    ],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-4 p-4 md:flex-row md:items-center md:gap-3 md:px-8 md:py-3",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-1 flex-col gap-3 md:w-0 md:flex-row md:items-center md:gap-2")],
            [
              verifiedIcon(h),
              h.div(
                [h.Class("flex flex-col gap-2 overflow-hidden lg:flex-row lg:gap-1.5")],
                [
                  h.p(
                    [h.Class("pr-8 text-sm font-semibold text-text-secondary md:truncate md:pr-0")],
                    [props.title],
                  ),
                  h.p(
                    [h.Class("text-sm text-text-tertiary md:truncate")],
                    [
                      `${props.policyPrefix} `,
                      h.a(
                        [
                          h.Class(
                            "rounded-xs underline decoration-utility-neutral-300 underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(props.policyHref),
                          h.OnClick(props.onPolicy),
                        ],
                        [props.policyLabel],
                      ),
                      ".",
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.div(
                [h.Class("flex w-full flex-col-reverse gap-2 md:flex-row md:gap-3")],
                [
                  actionButton(props.declineLabel, props.onDecline, false, h),
                  actionButton(props.allowLabel, props.onAllow, true, h),
                ],
              ),
              h.div(
                [
                  h.Class(
                    "absolute top-2 right-2 flex shrink-0 items-center justify-center md:static",
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
          ),
        ],
      ),
    ],
  );
