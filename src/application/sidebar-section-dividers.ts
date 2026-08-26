/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled mobile dialog mirrors the authenticated sidebar component branches directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  sidebarAccountCard,
  sidebarNavigationIcon,
  sidebarNavigationLogo,
  sidebarNavList,
  sidebarSearch,
} from "./sidebar-navigation-base.ts";
import type {
  SidebarNavigationBaseProps,
  SidebarNavigationItem,
} from "./sidebar-navigation-base.ts";

export interface SidebarSectionDividersProps<Message> {
  readonly activeUrl?: string;
  readonly expandedHrefs: readonly string[];
  readonly isAccountOpen: boolean;
  readonly isMobileOpen: boolean;
  readonly items: readonly SidebarNavigationItem[];
  readonly onAccountToggle: NoInfer<Message>;
  readonly onExpand: (href: string) => NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onNavigate: (href: string) => NoInfer<Message>;
  readonly onSearch: (value: string) => NoInfer<Message>;
  readonly searchValue: string;
}

const content = <Message>(
  props: SidebarSectionDividersProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const navigationProps: Pick<
    SidebarNavigationBaseProps<Message>,
    "activeUrl" | "expandedHrefs" | "items" | "onExpand" | "onNavigate"
  > = props;
  return h.aside(
    [
      h.AriaLabel("Sidebar navigation"),
      h.Class(
        "flex h-full w-full max-w-full flex-col justify-between overflow-auto rounded-none bg-bg-primary pt-4 shadow-xs ring-border-secondary ring-inset lg:w-69 lg:rounded-xl lg:pt-5 lg:ring-1",
      ),
    ],
    [
      h.div(
        [h.Class("flex flex-col gap-5 px-4 lg:px-5")],
        [sidebarNavigationLogo(h), sidebarSearch(props.searchValue, props.onSearch, h)],
      ),
      sidebarNavList(navigationProps, h),
      h.div(
        [h.Class("mt-auto flex flex-col gap-5 px-2 py-4 lg:gap-6 lg:px-4")],
        [sidebarAccountCard(props.isAccountOpen, props.onAccountToggle, h)],
      ),
    ],
  );
};

export const sidebarSectionDividers = <Message>(
  props: SidebarSectionDividersProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.DataAttribute("sidebar-section-dividers", "")],
    [
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
        [h.Class("hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-1 lg:pl-1")],
        [content(props, h)],
      ),
      h.div([
        h.AriaHidden(true),
        h.Class("invisible hidden lg:sticky lg:inset-y-0 lg:left-0 lg:block lg:pl-70"),
      ]),
    ],
  );
