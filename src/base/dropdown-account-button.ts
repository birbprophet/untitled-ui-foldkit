/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The account menu is a fixed controlled hierarchy. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownAccountButtonProps<Message> {
  readonly avatars: Readonly<Record<"olivia" | "sienna", string>>;
  readonly focusedId: string;
  readonly isDarkMode: boolean;
  readonly isOpen: boolean;
  readonly isSupportOpen: boolean;
  readonly onAccountSelect: (id: "olivia" | "sienna") => NoInfer<Message>;
  readonly onAction: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSupportToggle: NoInfer<Message>;
  readonly onThemeToggle: NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly selectedAccountId: "olivia" | "sienna";
}

const paths = {
  help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
  logout:
    "m16 17 5-5m0 0-5-5m5 5H9m0-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21H9",
  moon: "M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z",
  plus: "M12 5v14m-7-7h14",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
  user: "M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
} as const;

type MenuIcon = keyof typeof paths;

const icon = <Message>(name: MenuIcon, h: HtmlBuilder<Message>, withMargin = true): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(`${withMargin ? "mr-2 " : ""}size-4 shrink-0 stroke-[2.25px] text-fg-quaternary`),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(paths[name])])],
  );

const accountAvatar = <Message>(url: string, h: HtmlBuilder<Message>): Html =>
  h.span(
    [h.Class("mr-2 flex size-4 shrink-0 items-center justify-center")],
    [
      h.img([
        h.Alt(""),
        h.Class(
          "size-5 max-w-none shrink-0 rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16",
        ),
        h.Src(url),
      ]),
    ],
  );

const separator = <Message>(h: HtmlBuilder<Message>): Html =>
  h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")]);

const menuItem = <Message>(
  props: DropdownAccountButtonProps<Message>,
  id: string,
  label: string,
  h: HtmlBuilder<Message>,
  options?: {
    readonly addon?: string;
    readonly avatarUrl?: string;
    readonly icon?: MenuIcon;
    readonly radio?: boolean;
    readonly submenu?: boolean;
    readonly toggle?: boolean;
  },
): Html => {
  const selected = options?.radio === true && props.selectedAccountId === id;
  const role =
    options?.radio === true
      ? "menuitemradio"
      : options?.toggle === true
        ? "menuitemcheckbox"
        : "menuitem";
  return h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role(role),
      ...(options?.radio === true ? [h.AriaChecked(selected)] : []),
      ...(options?.toggle === true ? [h.AriaChecked(props.isDarkMode)] : []),
      ...(options?.submenu === true
        ? [h.AriaHasPopup("menu"), h.AriaExpanded(props.isSupportOpen)]
        : []),
      h.Tabindex(props.focusedId === id ? 0 : -1),
      h.DataAttribute("account-button-item", id),
      h.OnFocus(props.onFocus(id)),
      h.OnClick(
        options?.submenu === true
          ? props.onSupportToggle
          : options?.toggle === true
            ? props.onThemeToggle
            : options?.radio === true
              ? props.onAccountSelect(id === "sienna" ? "sienna" : "olivia")
              : props.onAction(id),
      ),
      h.OnKeyDownPreventDefault((key) =>
        key === "Escape" ? Option.some(props.onClose) : Option.none(),
      ),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
          ),
        ],
        [
          ...(options?.icon === undefined ? [] : [icon(options.icon, h)]),
          ...(options?.avatarUrl === undefined ? [] : [accountAvatar(options.avatarUrl, h)]),
          h.span([h.Class("grow truncate text-sm font-semibold text-text-secondary")], [label]),
          ...(options?.addon === undefined
            ? []
            : [
                h.span(
                  [h.Class("ml-1 shrink-0 pr-1 text-xs font-medium text-text-quaternary")],
                  [options.addon],
                ),
              ]),
          ...(options?.radio === true
            ? [
                h.span(
                  [
                    h.Class(
                      `ml-1 flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
                    ),
                  ],
                  selected ? [h.span([h.Class("size-1.5 rounded-full bg-fg-white")])] : [],
                ),
              ]
            : []),
          ...(options?.toggle === true
            ? [
                h.span(
                  [
                    h.Class(
                      `ml-1 flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition ${props.isDarkMode ? "bg-bg-brand-solid" : "bg-bg-quaternary"}`,
                    ),
                  ],
                  [
                    h.span([
                      h.Class(
                        `size-3 rounded-full bg-white shadow-xs transition ${props.isDarkMode ? "translate-x-4" : ""}`,
                      ),
                    ]),
                  ],
                ),
              ]
            : []),
          ...(options?.submenu === true
            ? [
                h.svg(
                  [
                    h.AriaHidden(true),
                    h.Class("ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary"),
                    h.Fill("none"),
                    h.Stroke("currentColor"),
                    h.StrokeLinecap("round"),
                    h.StrokeLinejoin("round"),
                    h.ViewBox("0 0 24 24"),
                  ],
                  [h.path([h.D("m9 18 6-6-6-6")])],
                ),
              ]
            : []),
        ],
      ),
    ],
  );
};

export const dropdownAccountButton = <Message>(
  props: DropdownAccountButtonProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [
          h.span([h.Class("px-0.5")], ["Account"]),
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("size-4 shrink-0 stroke-[2.25px] text-current/70"),
              h.Fill("none"),
              h.Stroke("currentColor"),
              h.StrokeLinecap("round"),
              h.StrokeLinejoin("round"),
              h.ViewBox("0 0 24 24"),
            ],
            [h.path([h.D("m6 9 6 6 6-6")])],
          ),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full right-0 z-20 mt-2 w-60 origin-top-right overflow-visible rounded-b-xl rounded-t-lg bg-bg-secondary-alt shadow-lg ring-1 ring-border-secondary-alt`,
          ),
        ],
        [
          h.div(
            [
              h.Class("rounded-b-xl rounded-t-lg bg-bg-primary py-1 ring-1 ring-border-secondary"),
              h.Role("menu"),
            ],
            [
              menuItem(props, "profile", "View profile", h, {
                addon: "⌘K→P",
                icon: "user",
              }),
              menuItem(props, "settings", "Settings", h, {
                addon: "⌘S",
                icon: "settings",
              }),
              menuItem(props, "dark-mode", "Dark mode", h, {
                icon: "moon",
                toggle: true,
              }),
              menuItem(props, "support", "Support", h, {
                icon: "help",
                submenu: true,
              }),
              separator(h),
              h.div(
                [h.Class("px-4 pt-1.5 pb-0.5 text-xs font-semibold text-text-brand-secondary")],
                ["Switch Account"],
              ),
              menuItem(props, "olivia", "Olivia Rhye", h, {
                avatarUrl: props.avatars.olivia,
                radio: true,
              }),
              menuItem(props, "sienna", "Sienna Hewitt", h, {
                avatarUrl: props.avatars.sienna,
                radio: true,
              }),
              menuItem(props, "add-account", "Add account", h, { icon: "plus" }),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-3 p-3")],
            [
              h.button(
                [
                  h.Class(
                    "relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-bg-primary px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("button"),
                  h.OnClick(props.onAction("sign-out")),
                ],
                [icon("logout", h, false), h.span([h.Class("px-0.5")], ["Sign out"])],
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                `${props.isSupportOpen ? "" : "hidden"} absolute top-28 left-[calc(100%+0.25rem)] z-30 w-50 overflow-auto rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt`,
              ),
              h.Role("menu"),
            ],
            [
              menuItem(props, "help-center", "Help center", h),
              menuItem(props, "contact-support", "Contact support", h),
              menuItem(props, "send-feedback", "Send feedback", h),
            ],
          ),
        ],
      ),
    ],
  );
