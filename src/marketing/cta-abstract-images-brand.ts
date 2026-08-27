/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaAbstractImagesBrandProps<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaAbstractImagesBrand = <Message>(
  props: CtaAbstractImagesBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-brand-section py-16 lg:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid max-w-container grid-cols-1 gap-16 overflow-hidden px-4 md:px-8 lg:grid-cols-2 lg:items-center",
          ),
        ],
        [
          h.div(
            [h.Class("flex max-w-3xl flex-col items-start")],
            [
              h.h2(
                [
                  h.Class(
                    "text-display-sm font-semibold text-primary_on-brand md:text-display-md lg:text-display-lg",
                  ),
                ],
                [props.heading],
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
            [
              h.Class(
                "grid h-122 w-[150%] grid-cols-[repeat(12,1fr)] grid-rows-[repeat(12,1fr)] gap-2 justify-self-center sm:h-124 sm:w-[120%] md:w-auto md:gap-4",
              ),
            ],
            [
              h.img([
                h.Alt("Marketing image"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/marketing/smiling-girl-5.webp"),
                h.Style("grid-area: 3 / 3 / 7 / 7"),
              ]),
              h.img([
                h.Alt("Marketing image"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/marketing/abstract-image-02.webp"),
                h.Style("grid-area: 1 / 7 / 7 / 11"),
              ]),
              h.img([
                h.Alt("Marketing image"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/marketing/abstract-image-03.webp"),
                h.Style("grid-area: 7 / 5 / 13 / 9"),
              ]),
              h.img([
                h.Alt("Marketing image"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/marketing/smiling-girl-6.webp"),
                h.Style("grid-area: 7 / 9 / 10 / 13"),
              ]),
              h.img([
                h.Alt("Marketing image"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/marketing/smiling-girl-2.webp"),
                h.Style("grid-area: 7 / 1 / 10 / 5"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
