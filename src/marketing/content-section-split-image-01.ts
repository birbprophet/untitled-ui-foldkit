/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionSplitImage01Props<Message> {
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onPrimary: NoInfer<Message>;
  readonly primaryLabel: string;
}

export const contentSectionSplitImage01 = <Message>(
  props: ContentSectionSplitImage01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("flex flex-col gap-12 bg-bg-primary py-16 md:gap-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col items-stretch justify-between gap-8 px-4 md:flex-row md:items-start md:px-8",
          ),
        ],
        [
          h.div(
            [h.Class("flex max-w-3xl flex-col")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                ["Why we're different"],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                  ),
                ],
                ["We bring honesty and transparency to financial services technology"],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper mattis lorem non.",
                ],
              ),
            ],
          ),
          h.button(
            [
              h.Class("rounded-lg bg-bg-brand-solid px-4 py-3 text-md font-semibold text-fg-white"),
              h.OnClick(props.onPrimary),
              h.Type("button"),
            ],
            [props.primaryLabel],
          ),
        ],
      ),
      h.div(
        [
          h.Class(
            "mx-auto grid w-full max-w-container grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8",
          ),
        ],
        [
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
          h.img([
            h.Alt(props.imageAlt),
            h.Class("h-60 w-full object-cover md:h-140"),
            h.Src(props.imageSrc),
          ]),
        ],
      ),
    ],
  );
