/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI footer. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingFooterLegalLinks,
  marketingFooterLegalList,
  marketingFooterLogo,
  marketingFooterQuickLinks,
  marketingFooterQuickNav,
  marketingFooterTheme,
} from "./marketing-footer-shared.ts";

export interface FooterLarge15BrandProps<Message> {
  readonly copyright: string;
  readonly onLink: (id: string) => NoInfer<Message>;
}

export const footerLarge15Brand = <Message>(
  props: FooterLarge15BrandProps<Message>,
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
                `mt-12 flex flex-col-reverse justify-between gap-4 border-t ${theme.border} pt-8 md:mt-16 md:flex-row md:gap-6`,
              ),
            ],
            [
              h.p([h.Class(theme.copyright)], [props.copyright]),
              marketingFooterLegalList(marketingFooterLegalLinks, true, props.onLink, h),
            ],
          ),
        ],
      ),
    ],
  );
};
