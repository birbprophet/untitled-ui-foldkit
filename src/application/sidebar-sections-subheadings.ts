/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled mobile dialog and source-authored section groups mirror the authenticated component branches directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { BrandLockup } from "../internal/brand.ts";
import {
  sidebarAccountCard,
  sidebarNavigationIcon,
  sidebarNavigationLogo,
  sidebarNavItem,
} from "./sidebar-navigation-base.ts";
import type { SidebarNavigationItem } from "./sidebar-navigation-base.ts";

export interface SidebarNavigationGroup {
  readonly items: readonly SidebarNavigationItem[];
  readonly label: string;
}

export interface SidebarSectionsSubheadingsProps<Message> {
  readonly accountAvatarUrl: string;
  readonly accountEmail: string;
  readonly accountName: string;
  readonly activeUrl?: string;
  readonly brand: BrandLockup;
  readonly groups: readonly SidebarNavigationGroup[];
  readonly isAccountOpen: boolean;
  readonly isMobileOpen: boolean;
  readonly onAccountToggle: NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onNavigate: (href: string) => NoInfer<Message>;
  readonly onSearch: NoInfer<Message>;
}

const searchButton = <Message>(onSearch: Message, h: HtmlBuilder<Message>): Html =>
  h.button(
    [
      h.AriaLabel("Search"),
      h.Class(
        "group relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(onSearch),
      h.Type("button"),
    ],
    [
      sidebarNavigationIcon("search", h, "size-4"),
      h.span(
        [
          h.Class(
            "pointer-events-none absolute top-[calc(100%+4px)] right-0 z-20 rounded-md bg-bg-primary-solid px-2 py-1 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
          ),
          h.Role("tooltip"),
        ],
        ["Search"],
      ),
    ],
  );

const content = <Message>(
  props: SidebarSectionsSubheadingsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.aside(
    [
      h.AriaLabel("Sidebar navigation"),
      h.Class(
        "flex h-full w-full max-w-full flex-col justify-between overflow-auto rounded-none bg-bg-primary pt-4 shadow-xs ring-border-secondary ring-inset lg:w-69 lg:rounded-xl lg:ring-1",
      ),
    ],
    [
      h.div(
        [h.Class("flex items-center justify-between gap-5 px-4 lg:pl-5")],
        [sidebarNavigationLogo(props.brand, h), searchButton(props.onSearch, h)],
      ),
      h.ul(
        [h.Class("mt-6 md:mt-5")],
        props.groups.map((group) =>
          h.li(
            [h.DataAttribute("navigation-group", group.label)],
            [
              h.div(
                [h.Class("px-5 pb-1")],
                [h.p([h.Class("text-xs font-bold text-text-quaternary uppercase")], [group.label])],
              ),
              h.ul(
                [h.Class("px-4 pb-5")],
                group.items.map((item) =>
                  h.li(
                    [h.Class("py-px")],
                    [sidebarNavItem(item, item.href === props.activeUrl, props.onNavigate, h)],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      h.div(
        [h.Class("mt-auto flex flex-col gap-5 px-2 py-4 lg:gap-6 lg:px-4")],
        [
          sidebarAccountCard(
            props.isAccountOpen,
            props.onAccountToggle,
            props.accountAvatarUrl,
            props.accountName,
            props.accountEmail,
            h,
          ),
        ],
      ),
    ],
  );

export const sidebarSectionsSubheadings = <Message>(
  props: SidebarSectionsSubheadingsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.DataAttribute("sidebar-sections-subheadings", "")],
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
                  [content(props, h)],
                ),
              ],
            ),
          ]
        : []),
      h.div(
        [h.Class("hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-1 lg:pl-1")],
        [content(props, h)],
      ),
      h.div([
        h.AriaHidden(true),
        h.Class("invisible hidden lg:sticky lg:inset-y-0 lg:left-0 lg:block lg:pl-70"),
      ]),
    ],
  );
