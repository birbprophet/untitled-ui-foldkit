/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaScreenMockup02Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaScreenMockup02 = <Message>(
  props: CtaScreenMockup02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("overflow-hidden bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
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
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-lg")],
                [props.heading],
              ),

              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
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
            [h.Class("relative mx-auto min-h-90 md:min-h-100 lg:mx-0 lg:min-h-142")],
            [
              h.img([
                h.Alt("Dashboard mockup"),
                h.Class(
                  "aspect-3/2 h-auto w-full max-w-5xl rounded object-cover shadow-3xl ring-4 ring-screen-mockup-border max-md:hidden md:ml-24 md:h-90 md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-128 dark:hidden",
                ),
                h.Src(
                  "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
                ),
              ]),
              h.img([
                h.Alt("Dashboard mockup"),
                h.Class(
                  "aspect-3/2 h-auto w-full max-w-5xl rounded object-cover shadow-3xl ring-4 ring-screen-mockup-border not-dark:hidden max-md:hidden md:ml-24 md:h-90 md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-128",
                ),
                h.Src(
                  "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
                ),
              ]),
              h.div(
                [
                  h.Class(
                    "absolute left-1/2 max-w-71 -translate-x-1/2 md:top-12 md:left-0 md:max-w-45 md:translate-x-0 lg:top-18 lg:max-w-61",
                  ),
                ],
                [
                  h.img([
                    h.Alt("Mobile app mockup"),
                    h.Class("w-full dark:hidden"),
                    h.Src(
                      "https://www.untitledui.com/marketing/screen-mockups/dashboard-mobile-mockup-light-01.webp",
                    ),
                  ]),
                  h.img([
                    h.Alt("Mobile app mockup"),
                    h.Class("w-full not-dark:hidden"),
                    h.Src(
                      "https://www.untitledui.com/marketing/screen-mockups/dashboard-mobile-mockup-dark-01.webp",
                    ),
                  ]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
