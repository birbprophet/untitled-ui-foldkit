/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaScreenMockup03Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaScreenMockup03 = <Message>(
  props: CtaScreenMockup03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("overflow-hidden bg-brand-section py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid max-w-container grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2",
          ),
        ],
        [
          h.div(
            [h.Class("flex w-full max-w-3xl flex-col")],
            [
              h.h1(
                [h.Class("text-display-sm font-semibold text-primary_on-brand md:text-display-lg")],
                [props.heading],
              ),
              h.ul(
                [h.Class("mt-8 flex flex-col gap-4 pl-2 md:gap-5 md:pl-4")],
                [
                  h.li(
                    [h.Class("flex gap-3")],
                    [
                      h.span(
                        [
                          h.Class(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-primary text-fg-brand-primary",
                          ),
                        ],
                        [
                          h.svg(
                            [
                              h.AriaHidden(true),
                              h.Class("size-4"),
                              h.Fill("none"),
                              h.Stroke("currentColor"),
                              h.StrokeLinecap("round"),
                              h.StrokeLinejoin("round"),
                              h.StrokeWidth("2"),
                              h.ViewBox("0 0 24 24"),
                            ],
                            [h.path([h.D("M20 6 9 17l-5-5")])],
                          ),
                        ],
                      ),
                      h.span(
                        [h.Class("text-md text-text-primary md:text-lg")],
                        ["30-day free trial"],
                      ),
                    ],
                  ),
                  h.li(
                    [h.Class("flex gap-3")],
                    [
                      h.span(
                        [
                          h.Class(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-primary text-fg-brand-primary",
                          ),
                        ],
                        [
                          h.svg(
                            [
                              h.AriaHidden(true),
                              h.Class("size-4"),
                              h.Fill("none"),
                              h.Stroke("currentColor"),
                              h.StrokeLinecap("round"),
                              h.StrokeLinejoin("round"),
                              h.StrokeWidth("2"),
                              h.ViewBox("0 0 24 24"),
                            ],
                            [h.path([h.D("M20 6 9 17l-5-5")])],
                          ),
                        ],
                      ),
                      h.span(
                        [h.Class("text-md text-text-primary md:text-lg")],
                        ["Personalized onboarding"],
                      ),
                    ],
                  ),
                  h.li(
                    [h.Class("flex gap-3")],
                    [
                      h.span(
                        [
                          h.Class(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand-primary text-fg-brand-primary",
                          ),
                        ],
                        [
                          h.svg(
                            [
                              h.AriaHidden(true),
                              h.Class("size-4"),
                              h.Fill("none"),
                              h.Stroke("currentColor"),
                              h.StrokeLinecap("round"),
                              h.StrokeLinejoin("round"),
                              h.StrokeWidth("2"),
                              h.ViewBox("0 0 24 24"),
                            ],
                            [h.path([h.D("M20 6 9 17l-5-5")])],
                          ),
                        ],
                      ),
                      h.span(
                        [h.Class("text-md text-text-primary md:text-lg")],
                        ["Access to all features"],
                      ),
                    ],
                  ),
                ],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-6 md:text-xl")],
                [props.description],
              ),
              h.div(
                [
                  h.Class(
                    "mt-8 flex flex-col-reverse gap-3 self-stretch sm:flex-row sm:items-start md:mt-12",
                  ),
                ],
                [
                  button(
                    {
                      color: "secondary",
                      label: props.secondaryLabel,
                      onPress: props.onSecondary,
                      size: "xl",
                    },
                    h,
                  ),
                  button(
                    {
                      color: "primary",
                      label: props.primaryLabel,
                      onPress: props.onPrimary,
                      size: "xl",
                    },
                    h,
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("relative mx-auto w-full lg:h-128")],
            [
              h.div(
                [
                  h.Class(
                    "top-0 left-0 w-full max-w-5xl rounded-[9.03px] bg-bg-primary p-[0.9px] shadow-lg ring-[0.56px] ring-utility-neutral-300 ring-inset md:rounded-[26.95px] md:p-[3.5px] md:ring-[1.68px] lg:absolute lg:w-max",
                  ),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "rounded-[7.9px] bg-bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[23.58px] md:p-1 md:shadow-modern-mockup-inner-lg",
                      ),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            "relative overflow-hidden rounded-[6.77px] bg-utility-neutral-50 ring-[0.56px] ring-utility-neutral-200 md:rounded-[20.21px] md:ring-[1.68px]",
                          ),
                        ],
                        [
                          h.img([
                            h.Alt("Dashboard mockup"),
                            h.Class("object-cover object-left-top dark:hidden"),
                            h.Src(
                              "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
                            ),
                          ]),
                          h.img([
                            h.Alt("Dashboard mockup"),
                            h.Class("object-cover object-left-top not-dark:hidden"),
                            h.Src(
                              "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
                            ),
                          ]),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
