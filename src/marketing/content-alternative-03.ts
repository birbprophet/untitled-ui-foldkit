/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI content layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentAlternative03Props {
  readonly authorAvatarSrc: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly description: string;
  readonly heading: string;
  readonly heroAlt: string;
  readonly heroSrc: string;
}

export const contentAlternative03 = (props: ContentAlternative03Props, h: HtmlBuilder): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "grid grid-cols-1 gap-16 px-4 py-16 md:grid-cols-2 md:justify-items-start md:gap-0 md:p-0",
          ),
        ],
        [
          h.div(
            [
              h.Class(
                "flex w-full max-w-(--breakpoint-sm) flex-col justify-between md:pt-24 md:pr-8 md:pb-16 md:pl-16",
              ),
            ],
            [
              h.h1(
                [
                  h.Class(
                    "mt-4 text-display-md font-semibold text-text-primary md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                [props.description],
              ),
              h.div(
                [h.Class("mt-8 flex items-center gap-3 md:mt-auto")],
                [
                  h.img([
                    h.Alt(props.authorName),
                    h.Class("size-12 rounded-full object-cover"),
                    h.Src(props.authorAvatarSrc),
                  ]),
                  h.div(
                    [],
                    [
                      h.p([h.Class("text-md font-semibold text-text-primary")], [props.authorName]),
                      h.p([h.Class("text-md text-text-tertiary")], [props.authorRole]),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.img([
            h.Alt(props.heroAlt),
            h.Class("h-80 w-full object-cover md:order-first md:h-200"),
            h.Src(props.heroSrc),
          ]),
        ],
      ),
      h.div(
        [h.Class("mx-auto max-w-container px-4 pb-16 md:px-8 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-prose md:max-w-180")],
            [
              h.div(
                [h.Class("prose-minimal-quote mx-auto prose md:prose-lg")],
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
