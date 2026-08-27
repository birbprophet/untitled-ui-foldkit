/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ContentSectionSimple01Props = Record<never, never>;

export const contentSectionSimple01 = <Message>(
  props: ContentSectionSimple01Props,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2")],
            [
              h.div(
                [h.Class("max-w-3xl lg:col-span-1")],
                [
                  h.div(
                    [
                      h.Class(
                        "hidden size-12 items-center justify-center rounded-lg bg-bg-brand-primary text-fg-brand-primary ring-1 ring-border-brand-alt ring-inset md:flex",
                      ),
                    ],
                    [
                      h.svg(
                        [
                          h.AriaHidden(true),
                          h.Class("size-6"),
                          h.Fill("none"),
                          h.Stroke("currentColor"),
                          h.StrokeLinecap("round"),
                          h.StrokeLinejoin("round"),
                          h.StrokeWidth("2"),
                          h.ViewBox("0 0 24 24"),
                        ],
                        [h.path([h.D("M13 2 3 14h9l-1 8 10-12h-9l1-8Z")])],
                      ),
                    ],
                  ),
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                    ["Features"],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                      ),
                    ],
                    ["Beautiful analytics to grow smarter"],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                    [
                      "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
                    ],
                  ),
                ],
              ),
              h.div(
                [h.Class("prose md:prose-lg")],
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
            ],
          ),
        ],
      ),
    ],
  );
