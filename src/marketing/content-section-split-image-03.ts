/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionSplitImage03Props<Message> {
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const contentSectionSplitImage03 = <Message>(
  props: ContentSectionSplitImage03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid w-full max-w-container grid-cols-1 items-center gap-12 px-4 md:gap-16 md:px-8 lg:grid-cols-2",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col")],
            [
              [
                h.span(
                  [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                  ["Our studio"],
                ),
                h.h2(
                  [
                    h.Class(
                      "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                    ),
                  ],
                  ["People first. Design later."],
                ),
                h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")], [""]),
              ],
              h.div(
                [h.Class("prose mt-8 md:prose-lg md:mt-12")],
                [
                  h.p(
                    [],
                    [
                      "Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis.",
                    ],
                  ),
                  h.p(
                    [],
                    [
                      "Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor.",
                    ],
                  ),
                  h.h2([], ["Introduction"]),
                  h.p(
                    [],
                    [
                      "Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.",
                    ],
                  ),
                ],
              ),
              h.div(
                [h.Class("mt-8 flex flex-col-reverse gap-3 md:mt-12 md:flex-row")],
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
            [h.Class("h-60 lg:h-163.5")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("size-full object-cover"),
                h.Src(props.imageSrc),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
