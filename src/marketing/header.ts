/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI marketing header. */
import { symbol } from "brand";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface HeaderNavItem {
  readonly hasMenu?: boolean;
  readonly href?: string;
  readonly id: string;
  readonly label: string;
}

export interface HeaderFooterLink {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface HeaderProps<Message> {
  readonly footerLinks: readonly HeaderFooterLink[];
  readonly isFloating?: boolean;
  readonly isFullWidth?: boolean;
  readonly isMobileOpen: boolean;
  readonly items: readonly HeaderNavItem[];
  readonly mobileExpandedItemId: string | null;
  readonly onFooterLink: (id: string) => NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly onLogin: NoInfer<Message>;
  readonly onMenuToggle: (id: string) => NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileExpand: (id: string) => NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onSignup: NoInfer<Message>;
  readonly openMenuId: string | null;
}

const chevronDown = <Message>(expanded: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `size-4 stroke-[2.625px] text-fg-quaternary transition duration-100 ease-linear ${expanded ? "-rotate-180" : "rotate-0"}`,
      ),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("m6 9 6 6 6-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2.625"),
      ]),
    ],
  );

const logo = <Message>(h: HtmlBuilder<Message>): Html =>
  h.span([h.Class("flex h-7 items-center gap-2 md:max-lg:hidden")], [
    h.img([h.Alt("Siglata robot symbol"), h.Class("size-7 rounded-md"), h.Src(symbol.url.href)]),
    h.span([h.Class("text-lg font-semibold text-text-primary")], ["Siglata"]),
  ]);

const logoMinimal = <Message>(h: HtmlBuilder<Message>): Html =>
  h.span([h.Class("hidden h-7 items-center md:inline-flex lg:hidden")], [
    h.img([h.Alt("Siglata robot symbol"), h.Class("size-7 rounded-md"), h.Src(symbol.url.href)]),
  ]);

const desktopNavItem = <Message>(
  item: HeaderNavItem,
  props: HeaderProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (item.hasMenu === true) {
    const expanded = props.openMenuId === item.id;
    return h.button(
      [
        h.AriaExpanded(expanded ? "true" : "false"),
        h.Class(
          "flex cursor-pointer items-center gap-0.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-text-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        h.OnClick(props.onMenuToggle(item.id)),
        h.Type("button"),
      ],
      [h.span([h.Class("px-0.5")], [item.label]), chevronDown(expanded, h)],
    );
  }

  return h.a(
    [
      h.Class(
        "flex cursor-pointer items-center gap-0.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-text-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(item.href ?? "#"),
      h.OnClick(props.onItem(item.id)),
    ],
    [h.span([h.Class("px-0.5")], [item.label])],
  );
};

const mobileNavItem = <Message>(
  item: HeaderNavItem,
  props: HeaderProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (item.href !== undefined) {
    return h.li([], [
      h.a(
        [
          h.Class("flex items-center justify-between px-4 py-3 text-sm font-semibold text-text-primary hover:bg-bg-primary_hover"),
          h.Href(item.href),
          h.OnClick(props.onItem(item.id)),
        ],
        [item.label],
      ),
    ]);
  }

  const expanded = props.mobileExpandedItemId === item.id;
  return h.li([h.Class("flex flex-col gap-0.5")], [
    h.button(
      [
        h.AriaExpanded(expanded ? "true" : "false"),
        h.Class(
          "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-text-primary hover:bg-bg-primary_hover",
        ),
        h.OnClick(props.onMobileExpand(item.id)),
        h.Type("button"),
      ],
      [item.label, chevronDown(expanded, h)],
    ),
    ...(expanded ? [h.div([h.Class("px-2 pb-2")], [])] : []),
  ]);
};

export const header = <Message>(props: HeaderProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.header(
    [
      h.Class(
        `relative flex h-16 w-full items-center justify-center md:h-18 ${props.isFloating === true ? "h-16 md:h-19 md:pt-3" : ""} ${props.isFullWidth === true && props.isFloating !== true ? "has-aria-expanded:bg-bg-primary" : "max-md:has-aria-expanded:bg-bg-primary"}`,
      ),
    ],
    [
      h.div([h.Class("flex size-full max-w-container flex-1 items-center pr-3 pl-4 md:px-8")], [
        h.div(
          [
            h.Class(
              `flex w-full justify-between gap-4 ${props.isFloating === true ? "ring-border-secondary_alt md:rounded-2xl md:bg-bg-primary md:py-3 md:pr-3 md:pl-4 md:shadow-xs md:ring-1" : ""}`,
            ),
          ],
          [
            h.div([h.Class("flex flex-1 items-center gap-5")], [
              logo(h),
              logoMinimal(h),
              h.nav([h.Class("max-md:hidden")], [
                h.ul(
                  [h.Class("flex items-center gap-0.5")],
                  props.items.map((item) =>
                    h.li([h.keyed("li")(item.id, [], [desktopNavItem(item, props, h)])]),
                  ),
                ),
              ]),
            ]),
            h.div([h.Class("hidden items-center gap-3 md:flex")], [
              button(
                {
                  color: "secondary",
                  label: "Log in",
                  onPress: props.onLogin,
                  size: props.isFloating === true ? "md" : "sm",
                },
                h,
              ),
              button(
                {
                  color: "primary",
                  label: "Sign up",
                  onPress: props.onSignup,
                  size: props.isFloating === true ? "md" : "sm",
                },
                h,
              ),
            ]),
            h.button(
              [
                h.AriaExpanded(props.isMobileOpen ? "true" : "false"),
                h.AriaLabel("Toggle navigation menu"),
                h.Class("group ml-auto rounded-lg p-2 md:hidden"),
                h.OnClick(props.isMobileOpen ? props.onMobileClose : props.onMobileOpen),
                h.Type("button"),
              ],
              [
                h.svg(
                  [h.AriaHidden(true), h.Class("size-6"), h.Fill("none"), h.ViewBox("0 0 24 24")],
                  [
                    h.path([
                      h.Class("hidden text-text-secondary group-aria-expanded:block"),
                      h.D("M18 6L6 18M6 6L18 18"),
                      h.Stroke("currentColor"),
                      h.StrokeLinecap("round"),
                      h.StrokeLinejoin("round"),
                      h.StrokeWidth("2"),
                    ]),
                    h.path([
                      h.Class("text-text-secondary group-aria-expanded:hidden"),
                      h.D("M3 12H21M3 6H21M3 18H21"),
                      h.Stroke("currentColor"),
                      h.StrokeLinecap("round"),
                      h.StrokeLinejoin("round"),
                      h.StrokeWidth("2"),
                    ]),
                  ],
                ),
              ],
            ),
          ],
        ),
      ]),
      ...(props.isMobileOpen
        ? [
            h.nav(
              [h.Class("absolute inset-x-0 top-full z-50 w-full bg-bg-primary shadow-lg md:hidden")],
              [
                h.ul(
                  [h.Class("flex flex-col gap-0.5 py-5")],
                  props.items.map((item) => mobileNavItem(item, props, h)),
                ),
                h.div([h.Class("flex flex-col gap-8 border-t border-border-secondary px-4 py-6")], [
                  h.ul(
                    [h.Class("grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-6 gap-y-3")],
                    props.footerLinks.map((link) =>
                      h.li([
                        h.keyed("li")(
                          link.id,
                          [],
                          [
                            button(
                              {
                                color: "link-gray",
                                href: link.href,
                                label: link.label,
                                onPress: props.onFooterLink(link.id),
                                size: "sm",
                              },
                              h,
                            ),
                          ],
                        ),
                      ]),
                    ),
                  ),
                  h.div([h.Class("flex flex-col gap-3")], [
                    button({ color: "primary", label: "Sign up", onPress: props.onSignup, size: "md" }, h),
                    button({ color: "secondary", label: "Log in", onPress: props.onLogin, size: "md" }, h),
                  ]),
                ]),
              ],
            ),
          ]
        : []),
    ],
  );
