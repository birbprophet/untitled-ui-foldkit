/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-negated-condition, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null, unicorn/no-nested-ternary -- The authenticated Untitled navigation anatomy is data-driven and preserves its optional badge, icon, identity, divider, input placeholder, and disclosure branches directly. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import type { BrandLockup } from "../internal/brand.ts";

export type SidebarNavigationIcon =
  | "browser"
  | "calendar"
  | "clock"
  | "dashboard"
  | "document"
  | "folder"
  | "grid"
  | "home"
  | "layers"
  | "lifebuoy"
  | "line-chart"
  | "notification"
  | "rows"
  | "reporting"
  | "settings"
  | "settings-sliders"
  | "support"
  | "star"
  | "tasks"
  | "user-square"
  | "users";

export interface SidebarNavigationItem {
  readonly avatarUrl?: string;
  readonly badge?: string;
  readonly divider?: boolean;
  readonly href?: string;
  readonly icon?: SidebarNavigationIcon;
  readonly items?: readonly SidebarNavigationItem[];
  readonly label?: string;
  readonly shortcut?: string;
}

export interface SidebarNavigationBaseProps<Message> {
  readonly accountAvatarUrl: string;
  readonly accountEmail: string;
  readonly accountName: string;
  readonly activeUrl?: string;
  readonly brand: BrandLockup;
  readonly expandedHrefs: readonly string[];
  readonly featureCard?: Html;
  readonly footerItems?: readonly SidebarNavigationItem[];
  readonly hideBorder?: boolean;
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
  readonly showAccountCard?: boolean;
}

const paths: Record<
  SidebarNavigationIcon | "chevron" | "close" | "menu" | "search" | "selector" | "share",
  string
> = {
  browser:
    "M3 9h18M9 9v12M7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3Z",
  calendar:
    "M21 10H3m13-8v4M8 2v4m-.2 16h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22Z",
  chevron: "m6 9 6 6 6-6",
  clock: "m22.7 11.5-2 2-2-2m2.245 1.5A9 9 0 1 0 19 17.657M12 7v5l3 2",
  close: "M17 7 7 17M7 7l10 10",
  dashboard:
    "M8 15v2m4-6v6m4-10v10m-8.2 4h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21Z",
  document:
    "M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z",
  folder:
    "m13 7-1.116-2.231c-.32-.642-.481-.963-.72-1.198a2 2 0 0 0-.748-.462C10.1 3 9.74 3 9.022 3H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 4.52 2 5.08 2 6.2V7m0 0h15.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 9.28 22 10.12 22 11.8v4.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C19.72 21 18.88 21 17.2 21H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 18.72 2 17.88 2 16.2V7Z",
  grid: "M8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 4.52 3 5.08 3 6.2V8m5 13H6.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 19.48 3 18.92 3 17.8V16m18-8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3H16m5 13v1.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 21 18.92 21 17.8 21H16m0-9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  home: "M8 17h8M11.018 2.764 4.235 8.039c-.453.353-.68.53-.843.75a2 2 0 0 0-.318.65C3 9.704 3 9.991 3 10.565V17.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8v-7.235c0-.574 0-.861-.074-1.126a2.002 2.002 0 0 0-.318-.65c-.163-.22-.39-.397-.843-.75l-6.783-5.275c-.351-.273-.527-.41-.72-.462a1 1 0 0 0-.523 0c-.194.052-.37.189-.721.462Z",
  layers:
    "m2 12 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 12M2 17l9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 17M2 7l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.11L22 7l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 7Z",
  lifebuoy:
    "M9.136 9.136 4.93 4.93m0 14.142 4.239-4.239m5.693.032 4.207 4.207m0-14.142-4.24 4.24M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-6 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  "line-chart":
    "m17 9-5.434 5.434c-.198.198-.297.297-.412.334a.499.499 0 0 1-.309 0c-.114-.037-.213-.136-.41-.334l-1.87-1.868c-.197-.198-.296-.297-.41-.334a.499.499 0 0 0-.31 0c-.114.037-.213.136-.41.334L3 17m14-8h-4m4 0v4m-9.2 8h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21Z",
  menu: "M3 12h12M3 6h18M3 18h18",
  notification:
    "M11 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v7.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h7.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 18.72 20 17.88 20 16.2V13m.121-9.121A3 3 0 1 1 15.88 8.12a3 3 0 0 1 4.24-4.24Z",
  reporting:
    "M12 2a10 10 0 0 1 10 10M12 2v10m0-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10M12 2c5.523 0 10 4.477 10 10m0 0H12m10 0a10 10 0 0 1-4.122 8.09L12 12",
  rows: "M17.8 10c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 8.48 21 7.92 21 6.8v-.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 4.52 3 5.08 3 6.2v.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 10 5.08 10 6.2 10h11.6Zm0 11c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8v-.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 14 18.92 14 17.8 14H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 15.52 3 16.08 3 17.2v.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21h11.6Z",
  search: "m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  selector: "m7 15 5 5 5-5M7 9l5-5 5 5",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
  "settings-sliders":
    "M15.05 9H5.5a2.5 2.5 0 0 1 0-5h9.55m-6.1 16h9.55a2.5 2.5 0 0 0 0-5H8.95M3 17.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Zm18-11a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
  share:
    "M21 9V3m0 0h-6m6 0-8 8m-3-6H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 7.28 3 8.12 3 9.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C19 18.72 19 17.88 19 16.2V14",
  star: "M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.502.502 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.498.498 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z",
  support:
    "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  tasks:
    "m6 15 2 2 4.5-4.5M8 8V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C9.52 2 10.08 2 11.2 2h7.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C22 3.52 22 4.08 22 5.2v7.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C20.48 16 19.92 16 18.8 16H16M5.2 22h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C16 20.48 16 19.92 16 18.8v-7.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 8 13.92 8 12.8 8H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 9.52 2 10.08 2 11.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 22 4.08 22 5.2 22Z",
  "user-square":
    "M4 21.817C4.603 22 5.416 22 6.8 22h10.4c1.384 0 2.197 0 2.8-.183m-16 0a2.18 2.18 0 0 1-.362-.144 3 3 0 0 1-1.311-1.311C2 19.72 2 18.88 2 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C4.28 2 5.12 2 6.8 2h10.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 4.28 22 5.12 22 6.8v10.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311 2.18 2.18 0 0 1-.362.144m-16 0c0-.809.005-1.237.077-1.597a4 4 0 0 1 3.143-3.143C7.606 17 8.07 17 9 17h6c.93 0 1.394 0 1.78.077a4 4 0 0 1 3.143 3.143c.072.36.077.788.077 1.597M16 9.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  users:
    "M22 21v-2a4.002 4.002 0 0 0-3-3.874M15.5 3.291a4.001 4.001 0 0 1 0 7.418M17 21c0-1.864 0-2.796-.305-3.53a4 4 0 0 0-2.164-2.165C13.796 15 12.864 15 11 15H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
};

export const sidebarNavigationIcon = <Message>(
  name: keyof typeof paths,
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
    [h.path([h.D(paths[name])])],
  );

export const sidebarNavButton = <Message>(
  navigationItem: SidebarNavigationItem,
  current: boolean,
  onSelect: (href: string) => Message,
  h: HtmlBuilder<Message>,
): Html => {
  const href = navigationItem.href ?? "#";
  const label = navigationItem.label ?? "";
  return h.a(
    [
      h.AriaLabel(label),
      h.Class(
        `group/item relative flex size-9 w-full cursor-pointer items-center justify-center rounded-md bg-bg-primary outline-focus-ring transition duration-100 ease-linear select-none hover:bg-bg-primary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${current ? "bg-bg-secondary hover:bg-bg-secondary-hover" : ""}`,
      ),
      h.Href(href),
      h.OnClick(onSelect(href)),
    ],
    [
      ...(navigationItem.icon === undefined
        ? []
        : [
            sidebarNavigationIcon(
              navigationItem.icon,
              h,
              `size-5 shrink-0 text-fg-quaternary transition-inherit-all group-hover/item:text-fg-quaternary-hover ${current ? "text-fg-quaternary-hover" : ""}`,
            ),
          ]),
      h.span(
        [
          h.Class(
            "pointer-events-none absolute left-[calc(100%+6px)] z-30 rounded-md bg-bg-primary-solid px-2 py-1 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg group-hover/item:opacity-100 group-focus-visible/item:opacity-100",
          ),
          h.Role("tooltip"),
        ],
        [label],
      ),
    ],
  );
};

export const sidebarNavigationLogo = <Message>(
  lockup: BrandLockup,
  h: HtmlBuilder<Message>,
): Html => h.img([h.Alt(lockup.mark.alt), h.Class("size-6 rounded-md"), h.Src(lockup.mark.src)]);

export const sidebarSearch = <Message>(
  value: string,
  onSearch: (value: string) => Message,
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
        [sidebarNavigationIcon("search", h)],
      ),
      h.input([
        h.AriaLabel("Search"),
        h.Class(
          "m-0 w-full bg-transparent py-2 pr-12 pl-10 text-sm text-text-primary outline-none placeholder:text-text-placeholder",
        ),
        h.OnInput(onSearch),
        h.Placeholder("Search"),
        h.Type("search"),
        h.Value(value),
      ]),
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
    ],
  );

const active = (item: SidebarNavigationItem, activeUrl: string | undefined): boolean =>
  item.href === activeUrl || item.items?.some((child) => child.href === activeUrl) === true;

export const sidebarNavItem = <Message>(
  item: SidebarNavigationItem,
  current: boolean,
  onNavigate: (href: string) => Message,
  h: HtmlBuilder<Message>,
  child = false,
): Html => {
  const href = item.href ?? "#";
  const isExternal = href.startsWith("http");
  return h.a(
    [
      ...(current ? [h.AriaCurrent("page")] : []),
      ...(isExternal ? [h.Rel("noopener noreferrer"), h.Target("_blank")] : []),
      h.Class(
        `group/item relative flex max-h-9 w-full cursor-pointer items-center rounded-md bg-bg-primary outline-focus-ring transition duration-100 ease-linear select-none hover:bg-bg-primary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${child ? "py-2 pr-3 pl-10" : "p-2"} ${current ? "bg-bg-secondary hover:bg-bg-secondary-hover" : ""}`,
      ),
      h.Href(href),
      h.OnClick(onNavigate(href)),
    ],
    [
      ...(item.avatarUrl === undefined
        ? item.icon === undefined
          ? []
          : [
              h.span(
                [
                  h.Class(
                    `mr-2 text-fg-quaternary transition-inherit-all group-hover/item:text-fg-quaternary-hover ${current ? "text-fg-quaternary-hover" : ""}`,
                  ),
                ],
                [sidebarNavigationIcon(item.icon, h)],
              ),
            ]
        : [
            h.span(
              [h.AriaHidden(true), h.Class("mr-2 flex size-5 shrink-0 [&>*]:size-5")],
              [avatar({ alt: "", size: "xs", src: item.avatarUrl }, h)],
            ),
          ]),
      h.span(
        [
          h.Class(
            `flex-1 truncate text-sm font-semibold text-text-secondary transition-inherit-all group-hover/item:text-text-secondary-hover ${current ? "text-text-secondary-hover" : ""}`,
          ),
        ],
        [item.label ?? ""],
      ),
      ...(isExternal
        ? [sidebarNavigationIcon("share", h, "size-4 shrink-0 text-fg-quaternary", "2.5")]
        : []),
      ...(item.shortcut === undefined
        ? item.badge === undefined
          ? []
          : [
              h.span(
                [
                  h.Class(
                    "ml-3 inline-flex min-w-6 items-center justify-center rounded-full bg-bg-secondary px-2 py-0.5 text-xs font-medium text-text-secondary ring-1 ring-border-secondary ring-inset",
                  ),
                ],
                [
                  ...(item.badge === "Online"
                    ? [h.span([h.Class("mr-1.5 size-1.5 rounded-full bg-fg-success-primary")])]
                    : []),
                  item.badge,
                ],
              ),
            ]
        : [
            h.span(
              [h.Class("ml-3 flex items-center gap-3")],
              [
                h.span(
                  [
                    h.Class(
                      "inline-flex min-w-6 items-center justify-center rounded-full bg-bg-secondary px-2 py-0.5 text-xs font-medium text-text-secondary ring-1 ring-border-secondary ring-inset",
                    ),
                  ],
                  [item.shortcut],
                ),
                sidebarNavigationIcon(
                  "chevron",
                  h,
                  "size-4 shrink-0 -rotate-90 text-fg-quaternary",
                  "2.5",
                ),
              ],
            ),
          ]),
    ],
  );
};

export const sidebarNavList = <Message>(
  props: Pick<
    SidebarNavigationBaseProps<Message>,
    "activeUrl" | "expandedHrefs" | "items" | "onExpand" | "onNavigate"
  >,
  h: HtmlBuilder<Message>,
  className = "flex flex-col px-4 pt-5",
): Html =>
  h.ul(
    [h.Class(className)],
    props.items.map((item, index) => {
      if (item.divider === true) {
        return h.li(
          [h.Class("w-full px-0.5 py-2")],
          [h.hr([h.Class("h-px w-full border-none bg-border-secondary")])],
        );
      }
      if (item.items !== undefined && item.items.length > 0) {
        const href = item.href ?? `#section-${String(index)}`;
        const isOpen = props.expandedHrefs.includes(href) || active(item, props.activeUrl);
        return h.li(
          [h.Class("py-px")],
          [
            h.details(
              [h.OnToggle(() => props.onExpand(href)), h.Open(isOpen)],
              [
                h.summary(
                  [
                    h.Class(
                      `group/item relative flex max-h-9 w-full cursor-pointer list-none items-center rounded-md bg-bg-primary p-2 outline-focus-ring transition duration-100 ease-linear select-none hover:bg-bg-primary-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${active(item, props.activeUrl) ? "bg-bg-secondary" : ""}`,
                    ),
                  ],
                  [
                    ...(item.icon === undefined
                      ? []
                      : [
                          h.span(
                            [h.Class("mr-2 text-fg-quaternary")],
                            [sidebarNavigationIcon(item.icon, h)],
                          ),
                        ]),
                    h.span(
                      [h.Class("flex-1 truncate text-sm font-semibold text-text-secondary")],
                      [item.label ?? ""],
                    ),
                    sidebarNavigationIcon(
                      "chevron",
                      h,
                      `ml-3 size-4 shrink-0 text-fg-quaternary transition-transform ${isOpen ? "-scale-y-100" : ""}`,
                      "2.5",
                    ),
                  ],
                ),
                h.ul(
                  [h.Class("pb-1")],
                  item.items.map((childItem) =>
                    h.li(
                      [h.Class("py-px")],
                      [
                        sidebarNavItem(
                          childItem,
                          childItem.href === props.activeUrl,
                          props.onNavigate,
                          h,
                          true,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        );
      }
      return h.li(
        [h.Class("py-px")],
        [sidebarNavItem(item, item.href === props.activeUrl, props.onNavigate, h)],
      );
    }),
  );

export const sidebarAccountCard = <Message>(
  isOpen: boolean,
  onToggle: Message,
  accountAvatarUrl: string,
  accountName: string,
  accountEmail: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-border-secondary ring-inset",
      ),
    ],
    [
      avatar(
        {
          alt: accountName,
          border: true,
          size: "md",
          src: accountAvatarUrl,
          status: "online",
        },
        h,
      ),
      h.div(
        [h.Class("min-w-0 flex-1")],
        [
          h.p([h.Class("truncate text-sm font-semibold text-text-primary")], [accountName]),
          h.p([h.Class("truncate text-sm text-text-tertiary")], [accountEmail]),
        ],
      ),
      h.button(
        [
          h.AriaExpanded(isOpen),
          h.AriaHasPopup("menu"),
          h.AriaLabel("Open account menu"),
          h.Class(
            "absolute top-2 right-2 flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.OnClick(onToggle),
          h.Type("button"),
        ],
        [sidebarNavigationIcon("selector", h, "size-4 shrink-0", "2.25")],
      ),
      ...(isOpen
        ? [
            h.div(
              [
                h.Class(
                  "absolute right-0 bottom-[calc(100%+8px)] z-20 w-66 rounded-xl bg-bg-primary py-1.5 shadow-lg ring-1 ring-border-secondary-alt",
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

const sidebarBody = <Message>(
  props: SidebarNavigationBaseProps<Message>,
  h: HtmlBuilder<Message>,
) =>
  h.aside(
    [
      h.AriaLabel("Sidebar navigation"),
      h.Class(
        `flex h-full w-full max-w-full flex-col overflow-auto bg-bg-primary pt-4 lg:w-70 lg:pt-5 ${props.hideBorder === true ? "" : "border-r border-border-secondary"}`,
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
      sidebarNavList(props, h),
      h.div(
        [h.Class("mt-auto flex flex-col gap-3 px-4 py-4 lg:py-5")],
        [
          ...(props.footerItems === undefined
            ? []
            : [
                h.ul(
                  [h.Class("flex flex-col")],
                  props.footerItems.map((item) =>
                    h.li(
                      [h.Class("py-px")],
                      [sidebarNavItem(item, item.href === props.activeUrl, props.onNavigate, h)],
                    ),
                  ),
                ),
              ]),
          ...(props.featureCard === undefined ? [] : [props.featureCard]),
          ...(props.showAccountCard === false
            ? []
            : [
                sidebarAccountCard(
                  props.isAccountOpen,
                  props.onAccountToggle,
                  props.accountAvatarUrl,
                  props.accountName,
                  props.accountEmail,
                  h,
                ),
              ]),
        ],
      ),
    ],
  );

export const sidebarSimpleLayout = <Message>(
  props: SidebarNavigationBaseProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.DataAttribute("sidebar-navigation-base", "")],
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
                  [sidebarBody(props, h)],
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
      h.div([h.Class("hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex")], [sidebarBody(props, h)]),
      h.div([
        h.AriaHidden(true),
        h.Class("invisible hidden lg:sticky lg:inset-y-0 lg:left-0 lg:block lg:pl-70"),
      ]),
    ],
  );
