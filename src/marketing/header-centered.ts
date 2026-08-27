/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface HeaderCenteredProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
}

export const headerCentered = <Message>(
  props: HeaderCenteredProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
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
        ],
      ),
    ],
  );
