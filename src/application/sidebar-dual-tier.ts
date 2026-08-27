/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/prefer-arr-match -- The renderer follows the authenticated responsive and controlled-hover branches directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { BrandLockup } from "../internal/brand.ts";
import {
  sidebarAccountCard,
  sidebarNavigationIcon,
  sidebarNavigationLogo,
  sidebarNavItem,
  sidebarNavList,
  sidebarSearch,
} from "./sidebar-navigation-base.ts";
import type { SidebarNavigationItem } from "./sidebar-navigation-base.ts";

export interface SidebarDualTierProps<Message> {
  readonly accountAvatarUrl: string;
  readonly activeUrl?: string;
  readonly brand: BrandLockup;
  readonly currentHref: string;
  readonly expandedHrefs: readonly string[];
  readonly featureCard?: Html;
  readonly footerItems: readonly SidebarNavigationItem[];
  readonly hideBorder?: boolean;
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
  readonly onSearch: (value: string) => NoInfer<Message>;
  readonly onSelect: (href: string) => NoInfer<Message>;
  readonly searchValue: string;
}

const mainSidebar = <Message>(
  props: SidebarDualTierProps<Message>,
  mobile: boolean,
  secondaryVisible: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const currentItem =
    [...props.items, ...props.footerItems].find((item) => item.href === props.currentHref) ??
    props.items[1] ??
    props.items[0];
  return h.aside(
    [
      h.AriaLabel("Primary sidebar navigation"),
      h.Class("group flex h-full max-h-full max-w-full overflow-y-auto bg-bg-primary"),
    ],
    [
      h.div(
        [
          h.Class(
            `relative flex w-full flex-col pt-4 transition duration-300 lg:w-70 lg:pt-5 ${props.hideBorder === true && !secondaryVisible ? "border-r border-transparent" : "border-r border-border-secondary"}`,
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-5 px-4 lg:px-5")],
            [
              sidebarNavigationLogo(props.brand, h),
              sidebarSearch(props.searchValue, props.onSearch, h),
            ],
          ),
          ...(mobile
            ? [
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
              ]
            : [
                h.ul(
                  [h.Class("mt-5 flex flex-col px-4")],
                  props.items.map((item) =>
                    h.li(
                      [h.Class("py-px")],
                      [sidebarNavItem(item, currentItem?.href === item.href, props.onSelect, h)],
                    ),
                  ),
                ),
              ]),
          h.div(
            [h.Class("mt-auto flex flex-col gap-3 px-2 py-4 lg:px-4 lg:py-6")],
            [
              h.ul(
                [h.Class("flex flex-col")],
                props.footerItems.map((item) =>
                  h.li(
                    [h.Class("py-px")],
                    [sidebarNavItem(item, currentItem?.href === item.href, props.onSelect, h)],
                  ),
                ),
              ),
              ...(props.featureCard === undefined ? [] : [props.featureCard]),
              sidebarAccountCard(
                props.isAccountOpen,
                props.onAccountToggle,
                props.accountAvatarUrl,
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
};

const secondarySidebar = <Message>(
  props: SidebarDualTierProps<Message>,
  currentItem: SidebarNavigationItem,
  h: HtmlBuilder<Message>,
): Html =>
  h.aside(
    [
      h.AriaLabel(`${currentItem.label ?? ""} navigation`),
      h.Class(
        `relative h-full w-64 overflow-x-hidden overflow-y-auto bg-bg-primary transition-[width] duration-300 ease-out ${props.hideBorder === true ? "" : "box-content border-r-[1.5px] border-border-secondary"}`,
      ),
    ],
    [
      h.ul(
        [h.Class("flex h-full w-64 flex-col p-4 pt-5")],
        (currentItem.items ?? []).map((item) =>
          h.li(
            [h.Class("py-px")],
            [sidebarNavItem(item, props.activeUrl === item.href, props.onNavigate, h)],
          ),
        ),
      ),
    ],
  );

export const sidebarDualTier = <Message>(
  props: SidebarDualTierProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const currentItem =
    [...props.items, ...props.footerItems].find((item) => item.href === props.currentHref) ??
    props.items[1] ??
    props.items[0];
  const secondaryVisible = props.isHovering && (currentItem?.items?.length ?? 0) > 0;
  return h.div(
    [h.DataAttribute("sidebar-dual-tier", "")],
    [
      h.header(
        [
          h.Class(
            "flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary p-3 pl-4 lg:hidden",
          ),
        ],
        [
          sidebarNavigationLogo(props.brand, h),
          h.button(
            [
              h.AriaExpanded(props.isMobileOpen),
              h.AriaLabel(props.isMobileOpen ? "Close navigation menu" : "Expand navigation menu"),
              h.Class(
                "flex items-center justify-center rounded-lg bg-bg-primary p-2 text-fg-secondary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
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
              [
                h.Class(
                  "fixed inset-0 z-50 cursor-pointer bg-overlay/70 pr-16 backdrop-blur-md lg:hidden",
                ),
              ],
              [
                h.button([
                  h.AriaLabel("Close navigation menu"),
                  h.Class("fixed inset-0 cursor-pointer"),
                  h.OnClick(props.onMobileClose),
                  h.Type("button"),
                ]),
                h.dialog(
                  [
                    h.AriaLabel("Mobile navigation"),
                    h.Class(
                      "relative m-0 h-dvh w-full max-w-74 cursor-auto border-0 bg-transparent p-0",
                    ),
                    h.OnCancel(props.onMobileClose),
                    h.Open(true),
                  ],
                  [mainSidebar(props, true, false, h)],
                ),
                h.button(
                  [
                    h.AriaLabel("Close navigation menu"),
                    h.Class(
                      "fixed top-2.5 right-3 flex items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2",
                    ),
                    h.OnClick(props.onMobileClose),
                    h.Type("button"),
                  ],
                  [sidebarNavigationIcon("close", h, "size-6")],
                ),
              ],
            ),
          ]
        : []),
      h.div(
        [
          h.Class("z-50 hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex"),
          h.OnMouseEnter(props.onHoverStart),
          h.OnMouseLeave(props.onHoverEnd),
        ],
        [
          mainSidebar(props, false, secondaryVisible, h),
          ...(secondaryVisible && currentItem !== undefined
            ? [secondarySidebar(props, currentItem, h)]
            : []),
        ],
      ),
      h.div([
        h.AriaHidden(true),
        h.Class("invisible hidden lg:sticky lg:inset-y-0 lg:left-0 lg:block lg:pl-70"),
      ]),
    ],
  );
};
