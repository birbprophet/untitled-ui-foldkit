/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI content layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentAlternative01Props {
  readonly authorAvatarSrc: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly badgeLabel: string;
  readonly description: string;
  readonly heading: string;
}

export const contentAlternative01 = <Message>(
  props: ContentAlternative01Props,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto grid max-w-container grid-cols-1 gap-16 bg-bg-primary px-4 pb-16 md:px-8 md:pb-24 lg:grid-cols-2 lg:gap-16 lg:pt-16",
          ),
        ],
        [
          h.img([
            h.Alt("Podcast girl"),
            h.Class("hidden h-160 object-cover lg:block"),
            h.Src("https://www.untitledui.com/marketing/podcast-girl-3.webp"),
          ]),
          h.div(
            [h.Class("flex flex-col justify-center gap-16 pt-16 lg:gap-32 lg:pt-32")],
            [
              h.div(
                [h.Class("flex flex-col items-start")],
                [
                  h.span(
                    [
                      h.Class(
                        "rounded-full bg-bg-brand-primary px-3 py-1 text-sm font-medium text-text-brand-secondary",
                      ),
                    ],
                    [props.badgeLabel],
                  ),
                  h.h1(
                    [
                      h.Class(
                        "mt-4 text-display-md font-semibold text-text-primary md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-8 md:text-xl")],
                    [props.description],
                  ),
                  h.div(
                    [h.Class("mt-8 flex items-center gap-3 md:mt-12")],
                    [
                      h.img([
                        h.Alt(props.authorName),
                        h.Class("size-12 rounded-full object-cover"),
                        h.Src(props.authorAvatarSrc),
                      ]),
                      h.div(
                        [],
                        [
                          h.p(
                            [h.Class("text-md font-semibold text-text-primary")],
                            [props.authorName],
                          ),
                          h.p([h.Class("text-md text-text-tertiary")], [props.authorRole]),
                        ],
                      ),
                    ],
                  ),
                  h.img([
                    h.Alt("Light wall with pictures"),
                    h.Class("mt-16 h-60 w-full object-cover md:h-110 lg:hidden"),
                    h.Src("https://images.unsplash.com/photo-1489769002049-ccd828976a6c"),
                  ]),
                ],
              ),
              h.div(
                [h.Class("mx-auto max-w-prose lg:max-w-180")],
                [
                  h.div(
                    [h.Class("prose-centered-quote mx-auto prose md:prose-lg")],
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
      ),
    ],
  );
