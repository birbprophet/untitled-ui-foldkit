/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionSimple02Props {}

export const contentSectionSimple02 = (props: ContentSectionSimple02Props, h: HtmlBuilder): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid w-full max-w-container grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8",
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col")],
            [
              [
                h.span(
                  [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                  ["Our mission"],
                ),
                h.h2(
                  [
                    h.Class(
                      "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                    ),
                  ],
                  ["Transforming marketplaces"],
                ),
                h.p(
                  [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                  [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper mattis lorem non.",
                  ],
                ),
              ],
              h.div(
                [h.Class("prose mt-10 hidden md:prose-lg md:block")],
                [h.hr([]), h.p([], ["Mi tincidunt elit, id quisque ligula ac diam, amet."])],
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
