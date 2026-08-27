/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Direct FoldKit transcription of the authenticated Untitled UI footer. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";
import {
  marketingFooterLogo,
  marketingFooterNavCategories,
  marketingFooterNavGrid,
  marketingFooterSocialList,
  marketingFooterSocials,
  marketingFooterTheme,
} from "./marketing-footer-shared.ts";

export interface FooterLarge12SocialProofAvatar {
  readonly alt: string;
  readonly id: string;
  readonly src: string;
}

export interface FooterLarge12Props<Message> {
  readonly copyright: string;
  readonly description: string;
  readonly email: string;
  readonly emailHint: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly formId: string;
  readonly newsletterDescription: string;
  readonly newsletterTitle: string;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onLink: (id: string) => NoInfer<Message>;
  readonly onSocial: (id: string) => NoInfer<Message>;
  readonly onSocialProof: NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly socialProofAvatars: readonly FooterLarge12SocialProofAvatar[];
  readonly socialProofLabel: string;
  readonly subscribeLabel: string;
}

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-4 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("m9 18 6-6-6-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const socialProofBadge = <Message>(
  props: FooterLarge12Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex w-max items-center gap-3 rounded-full bg-bg-primary_alt py-1.5 pr-2 pl-1.5 shadow-xs ring-1 ring-border-secondary_alt transition duration-100 ease-linear hover:bg-bg-primary_hover",
      ),
      h.Href("#"),
      h.OnClick(props.onSocialProof),
    ],
    [
      h.div(
        [h.Class("flex items-start")],
        props.socialProofAvatars.map((avatar, index) =>
          h.img([
            h.Alt(avatar.alt),
            h.Class(
              `${index === 0 ? "" : "-ml-1 "}size-6 rounded-full object-cover ring-[1.5px] ring-white outline-[0.5px] -outline-offset-[0.5px] outline-black/16`,
            ),
            h.Src(avatar.src),
          ]),
        ),
      ),
      h.hr([h.Class("h-4 w-px rounded-full border-none bg-border-secondary")]),
      h.div(
        [h.Class("flex items-center gap-1.5")],
        [
          h.p([h.Class("text-sm font-semibold text-text-primary")], [props.socialProofLabel]),
          chevronRight(h),
        ],
      ),
    ],
  );

export const footerLarge12 = <Message>(
  props: FooterLarge12Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const theme = marketingFooterTheme(false);
  return h.footer(
    [h.Class(theme.bg), h.Dir("ltr")],
    [
      h.div(
        [h.Class(`${theme.newsletterBand} py-10 md:py-12`)],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex flex-col items-start justify-between gap-8 md:flex-row")],
                [
                  h.div(
                    [h.Class("flex flex-col gap-4")],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-2 md:gap-4")],
                        [
                          h.p(
                            [
                              h.Class(`${theme.heading} md:text-display-sm`),
                              h.Id("newsletter-label"),
                            ],
                            [props.newsletterTitle],
                          ),
                          h.p(
                            [h.Class(theme.subheading), h.Id("newsletter-hint")],
                            [props.newsletterDescription],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.form(
                    [h.Class("w-full sm:w-100"), h.Id(props.formId), h.OnSubmit(props.onSubscribe)],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-4 sm:flex-row")],
                        [
                          h.div(
                            [h.Class("flex-1")],
                            [
                              input(
                                {
                                  isRequired: true,
                                  label: props.emailLabel,
                                  name: "email",
                                  onInput: props.onEmailInput,
                                  placeholder: props.emailPlaceholder,
                                  size: "lg",
                                  type: "email",
                                  value: props.email,
                                },
                                h,
                              ),
                            ],
                          ),
                          button({ label: props.subscribeLabel, size: "lg", type: "submit" }, h),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("mx-auto max-w-container px-4 py-12 md:px-8 md:pt-16")],
        [
          h.div(
            [h.Class("flex flex-col gap-12 md:gap-16 xl:flex-row")],
            [
              h.div(
                [h.Class("flex flex-col gap-6 md:w-80")],
                [
                  marketingFooterLogo(false, h),
                  h.p([h.Class(theme.description)], [props.description]),
                  socialProofBadge(props, h),
                ],
              ),
              marketingFooterNavGrid(
                marketingFooterNavCategories.slice(0, 5),
                5,
                false,
                props.onLink,
                h,
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                `mt-12 flex flex-col-reverse justify-between gap-6 border-t ${theme.border} pt-8 md:mt-16 md:flex-row`,
              ),
            ],
            [
              h.p([h.Class(theme.copyright)], [props.copyright]),
              marketingFooterSocialList(marketingFooterSocials, false, props.onSocial, h),
            ],
          ),
        ],
      ),
    ],
  );
};
