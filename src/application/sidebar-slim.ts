/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-arr-match, mps/prefer-option-over-null -- The renderer preserves the authenticated desktop rail, controlled hover panel, and mobile navigation branches directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import {
  sidebarAccountCard,
  sidebarNavigationIcon,
  sidebarNavigationLogo,
  sidebarNavButton,
  sidebarNavItem,
  sidebarNavList,
} from "./sidebar-navigation-base.ts";
import type { SidebarNavigationItem } from "./sidebar-navigation-base.ts";

export interface SidebarSlimProps<Message> {
  readonly activeUrl?: string;
  readonly currentHref: string;
  readonly expandedHrefs: readonly string[];
  readonly footerItems: readonly SidebarNavigationItem[];
  readonly hideBorder?: boolean;
  readonly hideRightBorder?: boolean;
  readonly isAccountOpen: boolean;
  readonly isHovering: boolean;
  readonly isMobileOpen: boolean;
  readonly items: readonly SidebarNavigationItem[];
  readonly onAccountToggle: NoInfer<Message>;
  readonly onExpand: (href: string) => NoInfer<Message>;
  readonly onHoverEnd: NoInfer<Message>;
  readonly onHoverStart: NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onNavigate: (href: string) => NoInfer<Message>;
  readonly onSelect: (href: string) => NoInfer<Message>;
}

const compactAccount = <Message>(
  isOpen: boolean,
  onToggle: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative")],
    [
      h.button(
        [
          h.AriaExpanded(isOpen),
          h.AriaHasPopup("menu"),
          h.AriaLabel("Open account menu"),
          h.Class(
            "group relative inline-flex rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(onToggle),
          h.Type("button"),
        ],
        [
          avatar(
            {
              alt: "Olivia Rhye",
              border: true,
              seed: "sidebar-olivia-rhye",
              size: "md",
              status: "online",
            },
            h,
          ),
        ],
      ),
      ...(isOpen
        ? [
            h.div(
              [
                h.Class(
                  "absolute bottom-0 left-[calc(100%+14px)] z-30 w-66 rounded-xl bg-bg-primary py-1.5 shadow-lg ring-1 ring-border-secondary-alt",
                ),
                h.Role("menu"),
              ],
              ["View profile", "Account settings", "Documentation", "Sign out"].map((label) =>
                h.button(
                  [
                    h.Class(
                      "flex w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-semibold text-text-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    ),
                    h.Role("menuitem"),
                    h.Type("button"),
                  ],
                  [label],
                ),
              ),
            ),
          ]
        : []),
    ],
  );

const desktop = <Message>(props: SidebarSlimProps<Message>, h: HtmlBuilder<Message>): Html => {
  const currentItem =
    props.items.find((item) => item.href === props.currentHref) ?? props.items[1] ?? props.items[0];
  const secondaryVisible = props.isHovering && (currentItem?.items?.length ?? 0) > 0;
  return h.div(
    [
      h.Class("z-50 hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex"),
      h.OnMouseEnter(props.onHoverStart),
      h.OnMouseLeave(props.onHoverEnd),
    ],
    [
      h.aside(
        [
          h.AriaLabel("Primary sidebar navigation"),
          h.Class(
            `group flex h-full max-h-full w-17 max-w-full overflow-y-auto py-1 pl-1 transition duration-100 ease-linear ${secondaryVisible ? "bg-bg-primary" : ""}`,
          ),
        ],
        [
          h.div(
            [
              h.Class(
                `flex w-auto flex-col justify-between rounded-xl bg-bg-primary pt-5 ring-1 ring-border-secondary ring-inset transition duration-300 ${props.hideBorder === true && !secondaryVisible ? "ring-transparent" : ""}`,
              ),
            ],
            [
              h.div([h.Class("flex justify-center px-3")], [sidebarNavigationLogo(h)]),
              h.ul(
                [h.Class("mt-5 flex flex-col gap-0.5 px-3.5")],
                props.items.map((item) =>
                  h.li(
                    [h.DataAttribute("nav-item", item.href ?? "")],
                    [sidebarNavButton(item, currentItem?.href === item.href, props.onSelect, h)],
                  ),
                ),
              ),
              h.div(
                [h.Class("mt-auto flex flex-col items-center gap-3 px-3 py-4")],
                [
                  h.ul(
                    [h.Class("flex flex-col gap-0.5")],
                    props.footerItems.map((item) =>
                      h.li(
                        [h.DataAttribute("footer-item", item.href ?? "")],
                        [
                          sidebarNavButton(
                            item,
                            currentItem?.href === item.href,
                            props.onSelect,
                            h,
                          ),
                        ],
                      ),
                    ),
                  ),
                  compactAccount(props.isAccountOpen, props.onAccountToggle, h),
                ],
              ),
            ],
          ),
        ],
      ),
      ...(secondaryVisible && currentItem !== undefined
        ? [
            h.aside(
              [
                h.AriaLabel(`${currentItem.label ?? ""} navigation`),
                h.Class(
                  `relative h-full w-64 overflow-x-hidden overflow-y-auto bg-bg-primary transition-[width] duration-300 ease-out ${props.hideBorder === true || props.hideRightBorder === true ? "" : "box-content border-r-[1.5px] border-border-secondary"}`,
                ),
              ],
              [
                h.div(
                  [h.Class("flex h-full w-64 flex-col px-4 pt-6")],
                  [
                    h.h3(
                      [h.Class("text-sm font-semibold text-text-brand-secondary")],
                      [currentItem.label ?? ""],
                    ),
                    h.ul(
                      [h.Class("py-2")],
                      (currentItem.items ?? []).map((item) =>
                        h.li(
                          [h.Class("py-px")],
                          [
                            sidebarNavItem(
                              item,
                              props.activeUrl === item.href,
                              props.onNavigate,
                              h,
                            ),
                          ],
                        ),
                      ),
                    ),
                    h.div(
                      [h.Class("sticky bottom-0 mt-auto flex justify-between bg-bg-primary pb-5")],
                      [
                        h.div(
                          [h.DataAttribute("account-identity", "")],
                          [
                            h.p(
                              [h.Class("text-sm font-semibold text-text-primary")],
                              ["Olivia Rhye"],
                            ),
                            h.p([h.Class("text-sm text-text-tertiary")], ["olivia@siglata.com"]),
                          ],
                        ),
                        h.button(
                          [
                            h.AriaLabel("Log out"),
                            h.Class(
                              "absolute -top-1 right-0 rounded-md p-1.5 text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2",
                            ),
                            h.Type("button"),
                          ],
                          [sidebarNavigationIcon("selector", h, "size-4")],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
};

const mobileContent = <Message>(props: SidebarSlimProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.aside(
    [
      h.AriaLabel("Mobile sidebar navigation"),
      h.Class(
        "group flex h-full max-h-full w-full max-w-full flex-col justify-between overflow-y-auto bg-bg-primary pt-4",
      ),
    ],
    [
      h.div([h.Class("px-4")], [sidebarNavigationLogo(h)]),
      sidebarNavList(
        {
          activeUrl: props.activeUrl,
          expandedHrefs: props.expandedHrefs,
          items: props.items,
          onExpand: props.onExpand,
          onNavigate: props.onNavigate,
        },
        h,
      ),
      h.div(
        [h.Class("mt-auto flex flex-col gap-3 p-4")],
        [
          h.div(
            [h.Class("flex flex-col")],
            props.footerItems.map((item) =>
              sidebarNavItem(item, props.activeUrl === item.href, props.onNavigate, h),
            ),
          ),
          sidebarAccountCard(props.isAccountOpen, props.onAccountToggle, h),
        ],
      ),
    ],
  );

export const sidebarSlim = <Message>(
  props: SidebarSlimProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.DataAttribute("sidebar-slim", "")],
    [
      desktop(props, h),
      h.div([
        h.AriaHidden(true),
        h.Class("invisible hidden lg:sticky lg:inset-y-0 lg:left-0 lg:block lg:pl-17"),
      ]),
      h.header(
        [
          h.Class(
            "flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary p-3 pl-4 lg:hidden",
          ),
        ],
        [
          sidebarNavigationLogo(h),
          h.button(
            [
              h.AriaExpanded(props.isMobileOpen),
              h.AriaLabel(props.isMobileOpen ? "Close navigation menu" : "Expand navigation menu"),
              h.Class(
                "rounded-lg p-2 text-fg-secondary outline-focus-ring focus-visible:outline-2",
              ),
              h.OnClick(props.isMobileOpen ? props.onMobileClose : props.onMobileOpen),
              h.Type("button"),
            ],
            [sidebarNavigationIcon(props.isMobileOpen ? "close" : "menu", h, "size-6")],
          ),
        ],
      ),
      ...(props.isMobileOpen
        ? [
            h.div(
              [h.Class("fixed inset-0 z-50 bg-overlay/70 pr-16 backdrop-blur-md lg:hidden")],
              [
                h.button([
                  h.AriaLabel("Close navigation menu"),
                  h.Class("fixed inset-0"),
                  h.OnClick(props.onMobileClose),
                  h.Type("button"),
                ]),
                h.dialog(
                  [
                    h.AriaLabel("Mobile navigation"),
                    h.Class("relative m-0 h-dvh w-full max-w-74 border-0 bg-transparent p-0"),
                    h.OnCancel(props.onMobileClose),
                    h.Open(true),
                  ],
                  [mobileContent(props, h)],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
