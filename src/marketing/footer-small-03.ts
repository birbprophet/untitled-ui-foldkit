/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, unicorn/no-nested-ternary -- Direct FoldKit transcription of the authenticated Untitled UI footer. */
import type { BrandLockup } from "../internal/brand.ts";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface FooterSmall03Link {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface FooterSmall03Props<Message> {
  readonly copyright: string;
  readonly homeHref: string;
  readonly links: readonly FooterSmall03Link[];
  readonly logo: BrandLockup;
  readonly onHome: NoInfer<Message>;
  readonly onLink: (id: string) => NoInfer<Message>;
}

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
          : [h.span([h.Class("text-lg font-semibold text-text-primary")], [lockup.text])]
        : [h.img([h.Class("h-4.5 w-auto"), h.Src(lockup.wordmarkSrc)])]),
    ],
  );

export const footerSmall03 = <Message>(
  props: FooterSmall03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.footer(
    [h.Class("bg-bg-primary py-12")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col justify-between lg:flex-row lg:items-center")],
            [
              h.div([h.Class("lg:w-40")], [logo(props.homeHref, props.onHome, props.logo, h)]),
              h.ul(
                [
                  h.Class(
                    "mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-[repeat(6,max-content)] lg:mt-0",
                  ),
                ],
                props.links.map((link) =>
                  h.keyed("li")(
                    link.id,
                    [h.Class("flex")],
                    [
                      button(
                        {
                          className: "max-h-5",
                          color: "link-gray",
                          href: link.href,
                          label: link.label,
                          onPress: props.onLink(link.id),
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                ),
              ),
              h.p(
                [h.Class("mt-12 text-sm text-text-quaternary lg:mt-0 lg:w-40 lg:text-right")],
                [props.copyright],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const footerSmall03DefaultLinks = [
  {
    href: "#",
    id: "overview",
    label: "Overview",
  },
  {
    href: "#",
    id: "features",
    label: "Features",
  },
  {
    href: "#",
    id: "pricing",
    label: "Pricing",
  },
  {
    href: "#",
    id: "careers",
    label: "Careers",
  },
  {
    href: "#",
    id: "help",
    label: "Help",
  },
  {
    href: "#",
    id: "privacy",
    label: "Privacy",
  },
] as const satisfies readonly FooterSmall03Link[];
