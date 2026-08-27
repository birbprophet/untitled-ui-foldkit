/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, unicorn/no-nested-ternary -- Direct FoldKit transcription of the authenticated Untitled UI footer. */
import type { BrandLockup } from "../internal/brand.ts";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";

export interface FooterLarge07BrandNavItem {
  readonly badge?: string;
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface FooterLarge07BrandNavGroup {
  readonly id: string;
  readonly items: readonly FooterLarge07BrandNavItem[];
  readonly label: string;
}

export interface FooterLarge07BrandSocial {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface FooterLarge07BrandProps<Message> {
  readonly copyright: string;
  readonly description: string;
  readonly homeHref: string;
  readonly logo: BrandLockup;
  readonly navGroups: readonly FooterLarge07BrandNavGroup[];
  readonly onHome: NoInfer<Message>;
  readonly onLink: (id: string) => NoInfer<Message>;
  readonly onSocial: (id: string) => NoInfer<Message>;
  readonly socials: readonly FooterLarge07BrandSocial[];
}

const socialIcon = <Message>(label: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.AriaLabel(label),
      h.Class("size-5"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M18 6 6 18M6 6l12 12")])],
  );

const logo = <Message>(
  homeHref: string,
  onHome: NoInfer<Message>,
  lockup: BrandLockup,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex items-center gap-2 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(homeHref),
      h.OnClick(onHome),
    ],
    [
      h.img([h.Alt(lockup.mark.alt), h.Class("size-8 rounded-lg"), h.Src(lockup.mark.src)]),
      ...(lockup.wordmarkSrc === undefined
        ? lockup.text === undefined
          ? []
          : [h.span([h.Class("text-lg font-semibold text-primary_on-brand")], [lockup.text])]
        : [h.img([h.Class("h-4.5 w-auto"), h.Src(lockup.wordmarkSrc)])]),
    ],
  );

export const footerLarge07Brand = <Message>(
  props: FooterLarge07BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.footer(
    [],
    [
      h.div(
        [h.Class("bg-brand-section py-12 md:pt-16")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex flex-col gap-8 md:gap-16 xl:flex-row")],
                [
                  h.div(
                    [h.Class("flex flex-col items-start gap-6 md:w-80")],
                    [
                      logo(props.homeHref, props.onHome, props.logo, h),
                      h.p([h.Class("text-md text-tertiary_on-brand")], [props.description]),
                    ],
                  ),
                  h.nav(
                    [h.Class("flex-1")],
                    [
                      h.ul(
                        [h.Class("grid flex-1 grid-cols-2 gap-8 md:grid-cols-4")],
                        props.navGroups.map((group) =>
                          h.keyed("li")(
                            group.id,
                            [],
                            [
                              h.h4(
                                [h.Class("text-sm font-semibold text-quaternary_on-brand")],
                                [group.label],
                              ),
                              h.ul(
                                [h.Class("mt-4 flex flex-col gap-3")],
                                group.items.map((item) =>
                                  h.keyed("li")(
                                    item.id,
                                    [h.Class("flex items-center gap-1")],
                                    [
                                      button(
                                        {
                                          className: "max-h-5",
                                          color: "link-color",
                                          href: item.href,
                                          label: item.label,
                                          onPress: props.onLink(item.id),
                                          size: "md",
                                        },
                                        h,
                                      ),
                                      ...(item.badge === undefined
                                        ? []
                                        : [
                                            badge(
                                              {
                                                color: "gray",
                                                label: item.badge,
                                                size: "sm",
                                                type: "modern",
                                              },
                                              h,
                                            ),
                                          ]),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
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
        [h.Class("bg-brand-section py-10 md:py-12")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [
                  h.Class(
                    "flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center",
                  ),
                ],
                [
                  h.p([h.Class("text-sm text-quaternary_on-brand")], [props.copyright]),
                  h.ul(
                    [h.Class("flex gap-4")],
                    props.socials.map((social) =>
                      h.keyed("li")(
                        social.id,
                        [],
                        [
                          h.a(
                            [
                              h.Class(
                                "flex rounded-xs text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.Href(social.href),
                              h.OnClick(props.onSocial(social.id)),
                              h.Rel("noopener noreferrer"),
                              h.Target("_blank"),
                            ],
                            [socialIcon(social.label, h)],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
