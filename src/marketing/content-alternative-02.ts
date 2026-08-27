/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI content layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentAlternative02Image {
  readonly alt: string;
  readonly src: string;
}

export interface ContentAlternative02Props {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly images: readonly ContentAlternative02Image[];
}

export const contentAlternative02 = <Message>(
  props: ContentAlternative02Props,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("overflow-hidden bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto w-full max-w-container px-4 py-16 md:px-8 md:py-24")],
        [
          h.div(
            [h.Class("max-w-3xl")],
            [
              h.div(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h1(
                [
                  h.Class(
                    "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 flex gap-6 overflow-x-auto md:mt-16")],
            props.images.map((image) =>
              h.keyed("img")(
                image.src,
                [h.Class("max-h-90 max-w-90 shrink-0 object-contain lg:max-h-180 lg:max-w-180")],
                [
                  h.img([
                    h.Alt(image.alt),
                    h.Class("size-auto max-h-90 max-w-90 object-contain lg:max-h-180 lg:max-w-180"),
                    h.Src(image.src),
                  ]),
                ],
              ),
            ),
          ),
        ],
      ),
      h.div(
        [h.Class("mx-auto max-w-container px-4 pb-16 md:px-8 md:pb-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-prose md:max-w-180")],
            [
              h.div(
                [h.Class("mx-auto prose md:prose-lg")],
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
