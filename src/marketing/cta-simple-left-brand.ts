/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI CTA section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface CtaSimpleLeftBrandProps<Message> {
  readonly description: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const ctaSimpleLeftBrand = <Message>(props: CtaSimpleLeftBrandProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.section([h.Class("bg-brand-section py-16 md:py-24"), h.Dir("ltr")], [
    h.div([h.Class("mx-auto max-w-container px-4 md:px-8")], [h.div([h.Class("flex flex-col justify-between lg:flex-row")], [
          h.div([h.Class("max-w-3xl")], [
            h.h2([h.Class("text-display-sm font-semibold text-primary_on-brand md:text-display-md")], [props.heading]),
            h.p([h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl")], [props.description]),
          ]),
          h.div([h.Class("mt-8 flex flex-col-reverse gap-3 self-stretch sm:flex-row sm:self-start lg:mt-0")], [
            button({ color: "secondary", label: props.secondaryLabel, onPress: props.onSecondary, size: "xl" }, h),
            button({ color: "primary", label: props.primaryLabel, onPress: props.onPrimary, size: "xl" }, h),
          ]),
        ])]),
  ]);
