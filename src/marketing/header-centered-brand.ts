/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface HeaderCenteredBrandProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
}

export const headerCenteredBrand = <Message>(
  props: HeaderCenteredBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-brand-section py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-secondary_on-brand md:text-md")],
                [props.eyebrow],
              ),
              h.h1(
                [
                  h.Class(
                    "mt-3 text-display-md font-semibold text-primary_on-brand md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-6 md:text-xl")],
                [props.description],
              ),
            ],
          ),
        ],
      ),
    ],
  );
