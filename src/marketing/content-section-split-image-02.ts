/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionSplitImage02Props<Message> {
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const contentSectionSplitImage02 = <Message>(
  props: ContentSectionSplitImage02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid w-full max-w-container grid-cols-1 gap-12 px-4 md:gap-16 md:px-8 lg:grid-cols-2",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col")],
            [
              [
                h.span(
                  [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                  ["Case study"],
                ),
                h.h2(
                  [
                    h.Class(
                      "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                    ),
                  ],
                  ["How we helped Hourglass"],
                ),
                h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")], [""]),
              ],
              h.div(
                [h.Class("prose mt-12 md:prose-lg")],
                [
                  h.hr([]),
                  h.p([], ["Mi tincidunt elit, id quisque ligula ac diam, amet."]),
                  h.h3(
                    [h.Class("mb-4 text-display-xs font-semibold md:mt-8")],
                    ["Closing more clients"],
                  ),
                  h.p([], ["Dolor enim eu tortor urna sed duis nulla."]),
                ],
              ),
              h.div(
                [h.Class("mt-12 hidden gap-3 md:flex")],
                [
                  h.button(
                    [
                      h.Class(
                        "rounded-lg border border-border-primary bg-bg-primary px-4 py-3 text-md font-semibold text-text-secondary",
                      ),
                      h.OnClick(props.onSecondary),
                      h.Type("button"),
                    ],
                    [props.secondaryLabel],
                  ),
                  h.button(
                    [
                      h.Class(
                        "rounded-lg bg-bg-brand-solid px-4 py-3 text-md font-semibold text-fg-white",
                      ),
                      h.OnClick(props.onPrimary),
                      h.Type("button"),
                    ],
                    [props.primaryLabel],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("relative h-140 lg:h-160")],
            [
              h.img([
                h.Alt("Lulu Meyers"),
                h.Class("size-full object-cover"),
                h.Src("https://www.untitledui.com/images/portraits/lulu-meyers"),
              ]),
              h.div(
                [
                  h.Class(
                    "absolute inset-x-0 bottom-0 bg-linear-to-t from-black/40 to-black/0 pt-16 md:pt-20 lg:pt-24",
                  ),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex flex-col gap-1.5 bg-primary/30 p-4 pb-5 backdrop-blur-[10px] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-alpha-white/30 md:gap-2 md:p-6",
                      ),
                    ],
                    [
                      h.p(
                        [
                          h.Class(
                            "text-xl font-semibold whitespace-nowrap text-white md:text-display-xs",
                          ),
                        ],
                        ["Lulu Meyers"],
                      ),
                      h.p([h.Class("text-md font-semibold text-white")], ["PM, Hourglass"]),
                      h.p([h.Class("text-sm font-medium text-white")], ["Web Design Agency"]),
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
