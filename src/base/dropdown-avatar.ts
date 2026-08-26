/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The avatar dropdown is a fixed controlled hierarchy. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownAvatarProps<Message> {
  readonly focusedId: string;
  readonly isDarkMode: boolean;
  readonly isOpen: boolean;
  readonly isSupportOpen: boolean;
  readonly onAction: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSupportToggle: NoInfer<Message>;
  readonly onThemeToggle: NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
}

const iconPaths = {
  chevron: "m6 9 6 6 6-6",
  container:
    "M20.5 7.278 12 12m0 0L3.5 7.278M12 12v9.5m9-5.441V7.942c0-.343 0-.514-.05-.667a1 1 0 0 0-.215-.364c-.109-.119-.258-.202-.558-.368l-7.4-4.111c-.284-.158-.425-.237-.575-.267a1 1 0 0 0-.403 0c-.15.03-.292.11-.576.267l-7.4 4.11c-.3.167-.45.25-.558.369a1 1 0 0 0-.215.364C3 7.428 3 7.599 3 7.942v8.117c0 .342 0 .514.05.666a1 1 0 0 0 .215.364c.109.119.258.202.558.368l7.4 4.111c.284.158.425.237.576.268.133.027.27.027.402 0 .15-.031.292-.11.576-.268l7.4-4.11c.3-.167.45-.25.558-.369a.999.999 0 0 0 .215-.364c.05-.152.05-.324.05-.666Z",
  help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
  layers:
    "m2 14.5 9.642 4.821c.131.066.197.099.266.111.06.012.123.012.184 0 .069-.012.135-.045.266-.11L22 14.5m-20-5 9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.111L22 9.5l-9.642 4.821a1.028 1.028 0 0 1-.266.111.501.501 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11L2 9.5Z",
  logout:
    "m16 17 5-5m0 0-5-5m5 5H9m0-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21H9",
  moon: "M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H3.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 7.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H20.1a1.499 1.499 0 0 0-1.373.91Z",
  user: "M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
} as const;

type IconName = keyof typeof iconPaths;
const orderedIds = ["profile", "settings", "dark-mode", "changelog", "support", "api"];

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

const agent = <Message>(
  id: string,
  label: string,
  size: 20 | 24 | 32 | 40,
  h: HtmlBuilder<Message>,
  alt = "",
): Html =>
  h.img([
    h.Alt(alt),
    h.Class(
      `${size === 20 ? "size-5" : size === 24 ? "size-6" : size === 32 ? "size-8" : "size-10"} max-w-none shrink-0 rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16`,
    ),
    h.Src(
      blobatarDataUri(`dropdown-avatar-${id}`, {
        background: "circle",
        kind: "agent",
        size: 128,
        title: label,
      }),
    ),
  ]);

const moveFocus = <Message>(props: DropdownAvatarProps<Message>, id: string, key: string) => {
  const index = orderedIds.indexOf(id);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (index === -1 || delta === 0) {
    return Option.none();
  }
  const next = orderedIds[(index + delta + orderedIds.length) % orderedIds.length];
  return next === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-dropdown-avatar-item="${next}"]`,
        message: props.onFocus(next),
      });
};

const menuItem = <Message>(
  props: DropdownAvatarProps<Message>,
  id: string,
  label: string,
  h: HtmlBuilder<Message>,
  options?: {
    readonly addon?: string;
    readonly icon?: IconName;
    readonly submenu?: boolean;
    readonly toggle?: boolean;
  },
): Html =>
  h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role(options?.toggle === true ? "menuitemcheckbox" : "menuitem"),
      ...(options?.toggle === true ? [h.AriaChecked(props.isDarkMode)] : []),
      ...(options?.submenu === undefined
        ? []
        : [h.AriaHasPopup("menu"), h.AriaExpanded(props.isSupportOpen)]),
      h.Tabindex(props.focusedId === id ? 0 : -1),
      h.DataAttribute("dropdown-avatar-item", id),
      h.OnFocus(props.onFocus(id)),
      h.OnClick(
        options?.submenu === true
          ? props.onSupportToggle
          : options?.toggle === true
            ? props.onThemeToggle
            : props.onAction(id),
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

export const dropdownAvatar = <Message>(
  props: DropdownAvatarProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            `group relative inline-flex cursor-pointer rounded-full outline-offset-2 outline-focus-ring ${props.isOpen ? "outline-2" : ""}`,
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
          h.Style({ "anchor-name": "--dropdown-avatar-trigger" }),
        ],
        [agent("olivia", "Olivia Rhye", 32, h, "Olivia Rhye")],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} fixed z-20 w-60 origin-top-right overflow-visible rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Style({
            "position-anchor": "--dropdown-avatar-trigger",
            right: "min(anchor(right), calc(100vw - 15rem - 0.75rem))",
            top: "calc(anchor(bottom) + 0.5rem)",
          }),
        ],
        [
          h.div(
            [h.Class("flex gap-3 border-b border-border-secondary p-3")],
            [
              h.figure(
                [h.Class("group flex min-w-0 flex-1 items-center gap-2")],
                [
                  h.span(
                    [
                      h.Class(
                        "relative size-10 shrink-0 rounded-full ring-1 ring-border-secondary-alt",
                      ),
                    ],
                    [
                      agent("olivia-menu", "Olivia Rhye", 40, h),
                      h.span([
                        h.AriaLabel("Online"),
                        h.Class(
                          "absolute right-0 bottom-0 size-2.5 rounded-full bg-fg-success-secondary ring-2 ring-bg-primary",
                        ),
                      ]),
                    ],
                  ),
                  h.figcaption(
                    [h.Class("min-w-0 flex-1")],
                    [
                      h.p([h.Class("text-sm font-semibold text-text-primary")], ["Olivia Rhye"]),
                      h.p([h.Class("truncate text-sm text-text-tertiary")], ["olivia@siglata.com"]),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("py-1"), h.Role("menu")],
            [
              menuItem(props, "profile", "View profile", h, { addon: "⌘K→P", icon: "user" }),
              menuItem(props, "settings", "Settings", h, { addon: "⌘S", icon: "settings" }),
              menuItem(props, "dark-mode", "Dark mode", h, { icon: "moon", toggle: true }),
              h.hr([h.Class("my-1 h-px border-0 bg-border-secondary")]),
              menuItem(props, "changelog", "Changelog", h, { addon: "⌘S", icon: "layers" }),
              menuItem(props, "support", "Support", h, { icon: "help", submenu: true }),
              menuItem(props, "api", "API", h, { icon: "container" }),
            ],
          ),
          h.div(
            [h.Class("flex flex-col gap-3 border-t border-border-secondary p-3")],
            [
              h.button(
                [
                  h.Class(
                    "inline-flex min-h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-bg-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Type("button"),
                  h.OnClick(props.onAction("sign-out")),
                ],
                [
                  icon("logout", "size-4 shrink-0 stroke-[2.25px] text-fg-quaternary", h),
                  "Sign out",
                ],
              ),
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
        ],
      ),
    ],
  );
