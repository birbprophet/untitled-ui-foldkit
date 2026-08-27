/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI marketing section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface NewsletterScreenMockup01Props<Message> {
  readonly ctaLabel: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onAction: NoInfer<Message>;
}

export const newsletterScreenMockup01 = <Message>(
  props: NewsletterScreenMockup01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex max-w-3xl flex-col items-center text-center")],
            [
              h.p([h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")], [props.eyebrow]),
              h.h2(
                [h.Class("mt-3 text-display-sm font-semibold text-text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")], [props.description]),
              h.button(
                [
                  h.Class(
                    "mt-8 inline-flex cursor-pointer items-center justify-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white shadow-xs outline-focus-ring hover:bg-bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnClick(props.onAction),
                  h.Type("button"),
                ],
                [props.ctaLabel],
              ),
            ],
          ),
        ],
      ),
    ],
  );
