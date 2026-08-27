/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI footer. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingFooterLogo,
  marketingFooterNewsletterForm,
  marketingFooterQuickLinks,
  marketingFooterQuickNav,
  marketingFooterTheme,
} from "./marketing-footer-shared.ts";

export interface FooterLarge16BrandProps<Message> {
  readonly copyright: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly formId: string;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onLink: (id: string) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly subscribeLabel: string;
}

export const footerLarge16Brand = <Message>(
  props: FooterLarge16BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const theme = marketingFooterTheme(true);
  return h.footer(
    [h.Class(`${theme.bg} py-12 md:pt-16`), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col gap-8 md:items-center")],
            [
              marketingFooterLogo(true, h),
              marketingFooterQuickNav(marketingFooterQuickLinks, true, props.onLink, h),
            ],
          ),
          h.div(
            [
              h.Class(
                "relative mt-12 flex flex-col justify-between gap-8 pt-8 md:mt-16 md:flex-row md:items-center",
              ),
            ],
            [
              h.div([h.Class("absolute top-0 left-0 h-px w-full bg-border-brand_alt")]),
              marketingFooterNewsletterForm(props, h),
              h.p([h.Class(theme.copyright)], [props.copyright]),
            ],
          ),
        ],
      ),
    ],
  );
};
