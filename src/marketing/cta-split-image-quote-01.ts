/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaSplitImageQuote01Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly quote: string;
  readonly quoteAuthor: string;
}

export const ctaSplitImageQuote01 = <Message>(props: CtaSplitImageQuote01Props<Message>, h: HtmlBuilder<Message>): Html =>
  h.section([h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")], [
    h.div([h.Class("mx-auto grid max-w-container grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2")], [h.div([h.Class("flex max-w-3xl flex-col items-start")], [
            h.h2([h.Class("text-display-sm font-semibold text-text-primary md:text-display-md lg:text-display-lg")], [props.heading]),
            h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")], [props.description]),
            h.div([h.Class("mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start md:mt-12")], [
              button({ color: "secondary", label: props.secondaryLabel, onPress: props.onSecondary, size: "xl" }, h),
              button({ color: "primary", label: props.primaryLabel, onPress: props.onPrimary, size: "xl" }, h),
            ]),
          ]), h.blockquote([h.Class("mt-6 border-l-4 border-border-brand pl-4")], [
            h.p([h.Class("text-lg text-text-primary md:text-xl")], [props.quote]),
            h.footer([h.Class("mt-4 text-md text-text-tertiary")], [props.quoteAuthor]),
          ]), h.img([h.Alt(props.imageAlt), h.Class("h-70 w-full object-cover md:h-140"), h.Src(props.imageSrc)])]),
  ]);
