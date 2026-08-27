/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionSimple05Props {}

export const contentSectionSimple05 = (props: ContentSectionSimple05Props, h: HtmlBuilder): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto w-full max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto max-w-180")],
            [
              h.figure(
                [],
                [
                  h.blockquote(
                    [],
                    [
                      h.p(
                        [h.Class("text-center text-xl font-medium not-italic md:text-display-xs")],
                        [
                          "Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies.",
                        ],
                      ),
                    ],
                  ),
                  h.figcaption(
                    [
                      h.Class(
                        "not-prose mt-6 flex flex-col items-center justify-center text-center md:mt-8",
                      ),
                    ],
                    [
                      h.img([
                        h.Alt("Olivia Rhye"),
                        h.Class("size-10 rounded-full object-cover"),
                        h.Src("https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"),
                      ]),
                      h.p(
                        [h.Class("mt-3 text-md font-semibold text-text-primary")],
                        ["Olivia Rhye"],
                      ),
                      h.cite(
                        [h.Class("mt-0.5 text-md text-text-tertiary not-italic")],
                        ["Product Designer"],
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
