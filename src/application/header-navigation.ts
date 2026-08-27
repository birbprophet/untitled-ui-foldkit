/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, foldkit/no-hardcoded-route-strings, mps/prefer-arr-match, mps/prefer-option-over-null -- The upstream item vocabulary, homepage link, and optional controlled props are part of the authenticated desktop, secondary, and mobile navigation anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { BrandLockup } from "../internal/brand.ts";

export interface HeaderNavigationItem {
  readonly badge?: string;
  readonly href: string;
  readonly label: string;
  readonly items?: readonly HeaderNavigationItem[];
}

export interface HeaderNavigationProps<Message> {
  readonly activeUrl?: string;
  readonly brand: BrandLockup;
  readonly centered?: boolean;
  readonly hideBorder?: boolean;
  readonly isMobileOpen: boolean;
  readonly items: readonly HeaderNavigationItem[];
  readonly onAccountPress: NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onNavigate: (href: string) => NoInfer<Message>;
  readonly onSearch: (value: string) => NoInfer<Message>;
  readonly searchValue: string;
  readonly secondaryType?: "buttons" | "tabs";
  readonly subItems?: readonly HeaderNavigationItem[];
}

type IconName = "bell" | "chevron" | "close" | "menu" | "search" | "settings";

const iconPath: Record<IconName, string> = {
  bell: "M9.354 21c.705.622 1.632 1 2.646 1s1.94-.378 2.646-1M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.089 1.936.015.182.054.252.2.36.133.099.732.099 1.928.099H18.61c1.196 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.088-1.936C18.78 13.206 18 11.09 18 8Z",
  chevron: "m6 9 6 6 6-6",
  close: "M18 6 6 18M6 6l12 12",
  menu: "M3 12h18M3 6h18M3 18h18",
  search: "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
};

const icon = <Message>(
  name: IconName,
  h: HtmlBuilder<Message>,
  className = "size-5 shrink-0",
  strokeWidth = "2",
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth(strokeWidth),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(iconPath[name])])],
  );

const searchInput = <Message>(
  props: HeaderNavigationProps<Message>,
  size: "sm" | "md",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative flex w-full items-center rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
      ),
    ],
    [
      h.span(
        [h.Class("pointer-events-none absolute left-3 text-fg-quaternary")],
        [icon("search", h, size === "sm" ? "size-4" : "size-5", size === "sm" ? "2.25" : "2")],
      ),
      h.input([
        h.AriaLabel("Search"),
        h.Class(
          `m-0 w-full bg-transparent pr-12 pl-9 text-text-primary outline-none placeholder:text-text-placeholder ${size === "sm" ? "py-2 text-sm" : "py-2 pl-10 text-md"}`,
        ),
        h.Name(size === "sm" ? "secondary-search" : "mobile-search"),
        h.OnInput(props.onSearch),
        h.Placeholder("Search"),
        h.Type("search"),
        h.Value(props.searchValue),
      ]),
      ...(size === "sm"
        ? [
            h.span(
              [
                h.AriaHidden(true),
                h.Class(
                  "pointer-events-none absolute inset-y-0.5 right-0.5 flex items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pr-1.5 pl-8",
                ),
              ],
              [
                h.kbd(
                  [
                    h.Class(
                      "rounded px-1 py-px font-mono text-xs font-medium text-text-quaternary ring-1 ring-border-secondary ring-inset",
                    ),
                  ],
                  ["⌘K"],
                ),
              ],
            ),
          ]
        : []),
    ],
  );

const logo = <Message>(lockup: BrandLockup, h: HtmlBuilder<Message>): Html =>
  h.span(
    [h.Class("flex w-[103px] items-center xl:w-26")],
    [h.img([h.Alt(lockup.mark.alt), h.Class("size-6 rounded-md"), h.Src(lockup.mark.src)])],
  );

const isActive = (href: string, activeUrl: string | undefined): boolean =>
  activeUrl === href || (href !== "/" && activeUrl?.startsWith(`${href}/`) === true);

const navButton = <Message>(
  item: HeaderNavigationItem,
  current: boolean,
  onNavigate: (href: string) => Message,
  h: HtmlBuilder<Message>,
  iconName?: IconName,
): Html =>
  h.a(
    [
      ...(current ? [h.AriaCurrent("page")] : []),
      ...(iconName === undefined ? [] : [h.AriaLabel(item.label)]),
      h.Class(
        `group/item relative flex cursor-pointer items-center justify-center gap-1 rounded-md bg-bg-primary outline-focus-ring transition duration-100 ease-linear select-none hover:bg-bg-primary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${current ? "bg-bg-secondary hover:bg-bg-secondary-hover" : ""} ${iconName === undefined ? "px-2 py-1.5" : "size-9"}`,
      ),
      h.Href(item.href),
      h.OnClick(onNavigate(item.href)),
    ],
    iconName === undefined
      ? [
          h.span(
            [
              h.Class(
                `px-0.5 text-sm font-semibold transition duration-100 ease-linear group-hover/item:text-text-secondary-hover ${current ? "text-text-secondary-hover" : ""}`,
              ),
            ],
            [item.label],
          ),
        ]
      : [
          h.span(
            [
              h.Class(
                `text-fg-quaternary transition-inherit-all group-hover/item:text-fg-quaternary-hover ${current ? "text-fg-quaternary-hover" : ""}`,
              ),
            ],
            [icon(iconName, h)],
          ),
        ],
  );

const primaryList = <Message>(
  items: readonly HeaderNavigationItem[],
  activeUrl: string | undefined,
  onNavigate: (href: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.nav(
    [h.AriaLabel("Primary navigation")],
    [
      h.ul(
        [h.Class("flex items-center gap-0.5")],
        items.map((item) =>
          h.li([], [navButton(item, isActive(item.href, activeUrl), onNavigate, h)]),
        ),
      ),
    ],
  );

const accountButton = <Message>(props: HeaderNavigationProps<Message>, h: HtmlBuilder<Message>) =>
  h.button(
    [
      h.Class(
        "inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 text-sm font-semibold text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover hover:text-text-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(props.onAccountPress),
      h.Type("button"),
    ],
    [h.span([], ["Account"]), icon("chevron", h, "size-4", "2.25")],
  );

const defaultActions = <Message>(
  props: HeaderNavigationProps<Message>,
  h: HtmlBuilder<Message>,
): readonly Html[] => [
  h.div(
    [h.Class("flex gap-0.5")],
    [
      navButton(
        { href: "/search", label: "Search" },
        props.activeUrl === "/search",
        props.onNavigate,
        h,
        "search",
      ),
      navButton(
        { href: "/settings-01", label: "Settings" },
        props.activeUrl === "/settings-01",
        props.onNavigate,
        h,
        "settings",
      ),
      h.div(
        [h.Class("relative")],
        [
          navButton(
            { href: "/notifications-01", label: "Notifications" },
            props.activeUrl === "/notifications-01",
            props.onNavigate,
            h,
            "bell",
          ),
          h.div(
            [
              h.Class(
                "absolute -top-0.25 -right-0.25 flex size-3.5 items-center justify-center rounded-full bg-fg-error-primary text-[10px] font-bold text-white",
              ),
            ],
            ["2"],
          ),
        ],
      ),
    ],
  ),
  accountButton(props, h),
];

const secondaryNavigation = <Message>(
  props: HeaderNavigationProps<Message>,
  items: readonly HeaderNavigationItem[],
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [
      h.Class(
        `flex w-full items-center justify-center bg-bg-primary ${props.hideBorder === true ? "" : "border-b border-border-secondary"}`,
      ),
    ],
    props.secondaryType === "tabs"
      ? [
          h.nav(
            [h.AriaLabel("Secondary navigation"), h.Class("w-full max-w-container px-8 pt-3")],
            [
              h.ul(
                [h.Class("flex gap-4")],
                items.map((item) => {
                  const current = isActive(item.href, props.activeUrl);
                  return h.li(
                    [],
                    [
                      h.a(
                        [
                          ...(current ? [h.AriaCurrent("page")] : []),
                          h.Class(
                            `flex border-b-2 px-1 pb-3 text-sm font-semibold ${current ? "border-brand-solid text-text-brand-secondary" : "border-transparent text-text-quaternary hover:text-text-secondary in-data-[theme=dark]:text-alpha-black"}`,
                          ),
                          h.Href(item.href),
                          h.OnClick(props.onNavigate(item.href)),
                        ],
                        [item.label],
                      ),
                    ],
                  );
                }),
              ),
            ],
          ),
        ]
      : [
          h.div(
            [
              h.Class(
                `flex h-16 w-full max-w-container items-center gap-8 px-8 ${props.centered === true ? "justify-center" : "justify-between"}`,
              ),
            ],
            [
              primaryList(items, props.activeUrl, props.onNavigate, h),
              ...(props.centered === true
                ? []
                : [h.div([h.Class("w-70")], [searchInput(props, "sm", h)])]),
            ],
          ),
        ],
  );

const mobileHeader = <Message>(props: HeaderNavigationProps<Message>, h: HtmlBuilder<Message>) =>
  h.div(
    [h.Class("lg:hidden")],
    [
      h.header(
        [
          h.Class(
            "flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary p-3 pl-4",
          ),
        ],
        [
          logo(props.brand, h),
          h.button(
            [
              h.AriaExpanded(props.isMobileOpen),
              h.AriaLabel(props.isMobileOpen ? "Close navigation menu" : "Expand navigation menu"),
              h.Class(
                "flex items-center justify-center rounded-lg bg-bg-primary p-2 text-fg-secondary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.OnClick(props.isMobileOpen ? props.onMobileClose : props.onMobileOpen),
              h.Type("button"),
            ],
            [icon(props.isMobileOpen ? "close" : "menu", h)],
          ),
        ],
      ),
      ...(props.isMobileOpen
        ? [
            h.div(
              [h.Class("fixed inset-0 z-50 cursor-pointer bg-overlay/70 pr-16 backdrop-blur-md")],
              [
                h.button([
                  h.AriaLabel("Close navigation menu"),
                  h.Class("fixed inset-0 cursor-pointer"),
                  h.OnClick(props.onMobileClose),
                  h.Type("button"),
                ]),
                h.aside(
                  [
                    h.AriaLabel("Mobile navigation"),
                    h.Class(
                      "flex h-dvh w-full max-w-74 cursor-auto flex-col overflow-auto bg-bg-primary pt-4",
                    ),
                  ],
                  [
                    h.div([h.Class("px-4")], [logo(props.brand, h)]),
                    h.div([h.Class("mt-5 px-4")], [searchInput(props, "md", h)]),
                    h.nav(
                      [h.AriaLabel("Mobile primary navigation"), h.Class("mt-5 px-4")],
                      [
                        h.ul(
                          [h.Class("flex flex-col")],
                          props.items.map((item) =>
                            h.li(
                              [h.Class("py-px")],
                              [
                                h.a(
                                  [
                                    ...(isActive(item.href, props.activeUrl)
                                      ? [h.AriaCurrent("page")]
                                      : []),
                                    h.Class(
                                      `flex max-h-9 w-full items-center rounded-md p-2 text-sm font-semibold text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${isActive(item.href, props.activeUrl) ? "bg-bg-secondary text-text-secondary-hover" : ""}`,
                                    ),
                                    h.Href(item.href),
                                    h.OnClick(props.onNavigate(item.href)),
                                  ],
                                  [item.label],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    h.div([h.Class("mt-auto p-4")], [accountButton(props, h)]),
                  ],
                ),
                h.button(
                  [
                    h.AriaLabel("Close navigation menu"),
                    h.Class(
                      "fixed top-2.5 right-3 flex items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring hover:bg-white/10 hover:text-fg-white focus-visible:outline-2 focus-visible:outline-offset-2",
                    ),
                    h.OnClick(props.onMobileClose),
                    h.Type("button"),
                  ],
                  [icon("close", h)],
                ),
              ],
            ),
          ]
        : []),
    ],
  );

export const headerNavigation = <Message>(
  props: HeaderNavigationProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const activeParent = props.items.find(
    (item) =>
      isActive(item.href, props.activeUrl) ||
      item.items?.some((child) => isActive(child.href, props.activeUrl)) === true,
  );
  const secondary = props.subItems ?? activeParent?.items ?? [];
  const hasSecondary = secondary[0] !== undefined;
  return h.div(
    [h.DataAttribute("header-navigation", "")],
    [
      mobileHeader(props, h),
      h.header(
        [h.Class("hidden lg:block")],
        [
          h.section(
            [
              h.Class(
                `flex h-16 w-full items-center justify-center bg-bg-primary ${props.hideBorder === true && !hasSecondary ? "" : "border-b border-border-secondary"}`,
              ),
            ],
            [
              h.div(
                [
                  h.Class(
                    `flex w-full max-w-container items-center pr-3 pl-4 md:px-8 ${props.centered === true ? "gap-8" : ""}`,
                  ),
                ],
                [
                  h.div(
                    [h.Class(`flex items-center ${props.centered === true ? "flex-1" : "mr-4"}`)],
                    [
                      h.a(
                        [
                          h.AriaLabel("Go to homepage"),
                          h.Class(
                            "rounded-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href("/"),
                          h.OnClick(props.onNavigate("/")),
                        ],
                        [logo(props.brand, h)],
                      ),
                    ],
                  ),
                  primaryList(props.items, props.activeUrl, props.onNavigate, h),
                  h.div(
                    [
                      h.Class(
                        `flex items-center gap-3 ${props.centered === true ? "flex-1 justify-end" : "ml-auto"}`,
                      ),
                    ],
                    defaultActions(props, h),
                  ),
                ],
              ),
            ],
          ),
          ...(hasSecondary ? [secondaryNavigation(props, secondary, h)] : []),
        ],
      ),
    ],
  );
};
