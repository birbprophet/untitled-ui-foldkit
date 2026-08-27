/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The small account card is a fixed controlled hierarchy. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownAccountCardSMProps<Message> {
  readonly avatars: Readonly<Record<"olivia" | "sienna", string>>;
  readonly focusedId: string;
  readonly isDarkMode: boolean;
  readonly isOpen: boolean;
  readonly isSignOutOpen: boolean;
  readonly isSupportOpen: boolean;
  readonly onAccountSelect: (id: "olivia" | "sienna") => NoInfer<Message>;
  readonly onAction: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSignOutToggle: NoInfer<Message>;
  readonly onSupportToggle: NoInfer<Message>;
  readonly onThemeToggle: NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly selectedAccountId: "olivia" | "sienna";
}

const iconPaths = {
  chevron: "m6 9 6 6 6-6",
  help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
  logout:
    "m16 17 5-5m0 0-5-5m5 5H9m0-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21H9",
  moon: "M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z",
  plus: "M12 5v14m-7-7h14",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
  user: "M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
} as const;

type IconName = keyof typeof iconPaths;
const orderedIds = [
  "profile",
  "settings",
  "dark-mode",
  "support",
  "olivia",
  "sienna",
  "add-account",
  "sign-out",
];

const icon = <Message>(name: IconName, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(iconPaths[name])])],
  );

const agent = <Message>(url: string, size: 20 | 24 | 32, h: HtmlBuilder<Message>): Html =>
  h.img([
    h.Alt(""),
    h.Class(
      `${size === 20 ? "size-5" : size === 24 ? "size-6" : "size-8"} max-w-none shrink-0 rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16`,
    ),
    h.Src(url),
  ]);

const moveFocus = <Message>(
  props: DropdownAccountCardSMProps<Message>,
  id: string,
  key: string,
) => {
  const index = orderedIds.indexOf(id);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (index === -1 || delta === 0) {
    return Option.none();
  }
  const next = orderedIds[(index + delta + orderedIds.length) % orderedIds.length];
  return next === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-account-card-sm-item="${next}"]`,
        message: props.onFocus(next),
      });
};

const menuItem = <Message>(
  props: DropdownAccountCardSMProps<Message>,
  id: string,
  label: string,
  h: HtmlBuilder<Message>,
  options?: {
    readonly addon?: string;
    readonly avatarUrl?: string;
    readonly icon?: IconName;
    readonly radio?: boolean;
    readonly submenu?: "sign-out" | "support";
    readonly toggle?: boolean;
  },
): Html => {
  const selected = options?.radio === true && props.selectedAccountId === id;
  return h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role(
        options?.radio === true
          ? "menuitemradio"
          : options?.toggle === true
            ? "menuitemcheckbox"
            : "menuitem",
      ),
      ...(options?.radio === true ? [h.AriaChecked(selected)] : []),
      ...(options?.toggle === true ? [h.AriaChecked(props.isDarkMode)] : []),
      ...(options?.submenu === undefined
        ? []
        : [
            h.AriaHasPopup("menu"),
            h.AriaExpanded(
              options.submenu === "support" ? props.isSupportOpen : props.isSignOutOpen,
            ),
          ]),
      h.Tabindex(props.focusedId === id ? 0 : -1),
      h.DataAttribute("account-card-sm-item", id),
      h.OnFocus(props.onFocus(id)),
      h.OnClick(
        options?.submenu === undefined
          ? options?.toggle === true
            ? props.onThemeToggle
            : options?.radio === true
              ? props.onAccountSelect(id === "sienna" ? "sienna" : "olivia")
              : props.onAction(id)
          : options.submenu === "support"
            ? props.onSupportToggle
            : props.onSignOutToggle,
      ),
      h.OnKeyDownFocus((key) => moveFocus(props, id, key)),
      h.OnKeyDownPreventDefault((key) =>
        key === "Escape" ? Option.some(props.onClose) : Option.none(),
      ),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${options?.submenu === undefined ? "" : "pr-1.5"} ${props.focusedId === id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
          ),
        ],
        [
          ...(options?.avatarUrl === undefined
            ? []
            : [
                h.span(
                  [h.Class("mr-2 flex size-4 shrink-0 items-center justify-center")],
                  [agent(options.avatarUrl, 20, h)],
                ),
              ]),
          ...(options?.icon === undefined
            ? []
            : [icon(options.icon, "mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary", h)]),
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
                      `ml-1 flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 ${props.isDarkMode ? "bg-bg-brand-solid" : "bg-bg-quaternary"}`,
                    ),
                  ],
                  [
                    h.span([
                      h.Class(
                        `size-3 rounded-full bg-white shadow-xs ${props.isDarkMode ? "translate-x-4" : ""}`,
                      ),
                    ]),
                  ],
                ),
              ]
            : []),
          ...(options?.submenu === undefined
            ? []
            : [
                icon(
                  "chevron",
                  "ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary -rotate-90",
                  h,
                ),
              ]),
        ],
      ),
    ],
  );
};

export const dropdownAccountCardSM = <Message>(
  props: DropdownAccountCardSMProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            `relative flex w-42 cursor-pointer items-center gap-2 rounded-lg bg-bg-primary-alt p-1.5 text-left ring-1 ring-border-secondary ring-inset outline-offset-2 outline-focus-ring ${props.isOpen ? "outline-2" : ""}`,
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [
          h.span(
            [h.Class("relative shrink-0 rounded-full p-px ring-1 ring-border-secondary-alt")],
            [
              agent(props.avatars.olivia, 32, h),
              h.span([
                h.AriaLabel("Online"),
                h.Class(
                  "absolute right-0 bottom-0 size-2 rounded-full bg-fg-success-secondary ring-[1.5px] ring-bg-primary",
                ),
              ]),
            ],
          ),
          h.p([h.Class("text-sm font-semibold text-text-primary")], ["Olivia Rhye"]),
          h.span(
            [h.Class("absolute top-2 right-2 flex size-7 items-center justify-center rounded-md")],
            [icon("chevron", "size-4 shrink-0 stroke-[2.25px] text-fg-quaternary", h)],
          ),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full right-0 z-20 mt-1.5 w-60 origin-top-right overflow-visible rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
        ],
        [
          h.div(
            [h.Class("flex flex-col border-b border-border-secondary px-4 py-3")],
            [
              h.p([h.Class("text-sm font-semibold text-text-primary")], ["PRO account"]),
              h.p([h.Class("text-sm text-text-tertiary")], ["olivia@siglata.com"]),
            ],
          ),
          h.div(
            [h.Class("py-1"), h.Role("menu")],
            [
              menuItem(props, "profile", "View profile", h, { addon: "⌘K→P", icon: "user" }),
              menuItem(props, "settings", "Settings", h, { addon: "⌘S", icon: "settings" }),
              menuItem(props, "dark-mode", "Dark mode", h, { icon: "moon", toggle: true }),
              menuItem(props, "support", "Support", h, { icon: "help", submenu: "support" }),
              h.hr([h.Class("my-1 h-px border-0 bg-border-secondary")]),
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
              h.hr([h.Class("my-1 h-px border-0 bg-border-secondary")]),
              menuItem(props, "sign-out", "Sign out", h, {
                icon: "logout",
                submenu: "sign-out",
              }),
            ],
          ),
          h.div(
            [h.Class("flex justify-between border-t border-border-secondary px-4 py-3")],
            [
              h.span([h.Class("truncate text-sm text-text-quaternary")], ["© Siglata"]),
              h.span([h.Class("text-sm text-text-quaternary")], ["v12.6.8"]),
            ],
          ),
          h.div(
            [
              h.Class(
                `${props.isSupportOpen ? "" : "hidden"} absolute top-32 left-[calc(100%+0.25rem)] z-30 w-50 rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt`,
              ),
              h.Role("menu"),
            ],
            [
              menuItem(props, "help-center", "Help center", h),
              menuItem(props, "contact-support", "Contact support", h),
              menuItem(props, "send-feedback", "Send feedback", h),
            ],
          ),
          h.div(
            [
              h.Class(
                `${props.isSignOutOpen ? "" : "hidden"} absolute bottom-1 left-[calc(100%+0.25rem)] z-30 w-50 rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt`,
              ),
              h.Role("menu"),
            ],
            [
              menuItem(props, "current-device", "Current device", h),
              menuItem(props, "all-devices", "All devices", h),
            ],
          ),
        ],
      ),
    ],
  );
