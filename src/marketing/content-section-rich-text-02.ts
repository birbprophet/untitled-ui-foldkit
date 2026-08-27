/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ContentSectionRichText02Props = Record<never, never>;

export const contentSectionRichText02 = <Message>(
  props: ContentSectionRichText02Props,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto prose md:prose-lg md:max-w-180")],
            [
              h.p([], ["Mi tincidunt elit, id quisque ligula ac diam, amet."]),
              h.h2([], ["What information do we collect?"]),
              h.p(
                [],
                [
                  "Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.",
                ],
              ),
              h.h2([], ["How do we use your information?"]),
              h.p(
                [],
                [
                  "Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus.",
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
