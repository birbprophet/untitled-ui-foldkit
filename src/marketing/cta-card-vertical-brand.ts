/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA card section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaCardVerticalBrandProps<Message> {
  readonly description: string;
  readonly heading: string;
  readonly headingMobile: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaCardVerticalBrand = <Message>(
  props: CtaCardVerticalBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [
              h.Class(
                "flex flex-col gap-x-8 gap-y-8 rounded-2xl bg-brand-section px-6 py-10 lg:p-16 flex-col",
              ),
            ],
            [
              h.div(
                [h.Class("flex max-w-3xl flex-1 flex-col")],
                [
                  h.h2(
                    [
                      h.Class(
                        "text-display-sm font-semibold text-primary_on-brand md:text-display-md",
                      ),
                    ],
                    [
                      h.span([h.Class("hidden md:inline")], [props.heading]),
                      h.span([h.Class("md:hidden")], [props.headingMobile]),
                    ],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-5 lg:text-xl")],
                    [props.description],
                  ),
                ],
              ),
              h.div(
                [h.Class("flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start")],
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
        ],
      ),
    ],
  );
