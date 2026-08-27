/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The authenticated source ID is a five-export foundation barrel, so this dedicated renderer presents those exact primitives as one specimen. */
import type { Html, HtmlBuilder } from "foldkit/html";

import type { BrandLockup } from "../internal/brand.ts";
import {
  sidebarAccountCard,
  sidebarNavigationIcon,
  sidebarNavigationLogo,
  sidebarNavButton,
  sidebarNavList,
} from "./sidebar-navigation-base.ts";
import type { SidebarNavigationItem } from "./sidebar-navigation-base.ts";

export interface SidebarNavigationBaseProps<Message> {
  readonly accountAvatarUrl: string;
  readonly activeUrl?: string;
  readonly brand: BrandLockup;
  readonly expandedHrefs: readonly string[];
  readonly isAccountOpen: boolean;
  readonly isMobileOpen: boolean;
  readonly items: readonly SidebarNavigationItem[];
  readonly onAccountToggle: NoInfer<Message>;
  readonly onExpand: (href: string) => NoInfer<Message>;
  readonly onMobileClose: NoInfer<Message>;
  readonly onMobileOpen: NoInfer<Message>;
  readonly onNavigate: (href: string) => NoInfer<Message>;
}

const mobileHeader = <Message>(
  props: SidebarNavigationBaseProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
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
  );

export const sidebarNavigationBase = <Message>(
  props: SidebarNavigationBaseProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("min-h-dvh bg-bg-primary p-6"), h.DataAttribute("sidebar-navigation-base", "")],
    [
      h.div(
        [h.Class("mx-auto grid max-w-4xl gap-8")],
        [
          h.section(
            [
              h.AriaLabel("Mobile navigation header specimen"),
              h.Class("overflow-hidden rounded-xl ring-1 ring-border-secondary"),
            ],
            [mobileHeader(props, h)],
          ),
          h.div(
            [h.Class("grid items-start gap-8 md:grid-cols-[68px_280px_280px]")],
            [
              h.section(
                [
                  h.AriaLabel("Navigation button specimen"),
                  h.Class("rounded-xl bg-bg-primary p-4 ring-1 ring-border-secondary"),
                ],
                [
                  sidebarNavButton(
                    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
                    props.activeUrl === "/dashboard",
                    props.onNavigate,
                    h,
                  ),
                ],
              ),
              h.section(
                [
                  h.AriaLabel("Navigation list specimen"),
                  h.Class("rounded-xl bg-bg-primary pb-5 ring-1 ring-border-secondary"),
                ],
                [
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
                ],
              ),
              h.section(
                [h.AriaLabel("Navigation account card specimen")],
                [
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
                h.dialog(
                  [
                    h.AriaLabel("Mobile navigation"),
                    h.Class(
                      "relative m-0 h-dvh w-full max-w-74 cursor-auto border-0 bg-bg-primary p-0",
                    ),
                    h.OnCancel(props.onMobileClose),
                    h.Open(true),
                  ],
                  [
                    h.div([h.Class("px-4 pt-4")], [sidebarNavigationLogo(props.brand, h)]),
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
                      [h.Class("mt-auto p-4")],
                      [
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
                h.button(
                  [
                    h.AriaLabel("Close navigation menu"),
                    h.Class(
                      "fixed top-2.5 right-3 flex items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring",
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
    ],
  );
