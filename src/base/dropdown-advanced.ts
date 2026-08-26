/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The upstream advanced menu is a fixed controlled hierarchy. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export type DropdownAdvancedSubmenu = "developer" | "more-tools" | "none" | "save-as";

export interface DropdownAdvancedProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onSubmenuChange: (submenu: DropdownAdvancedSubmenu) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly onViewOptionToggle: (id: "show-bookmarks" | "show-urls") => NoInfer<Message>;
  readonly openSubmenu: DropdownAdvancedSubmenu;
  readonly selectedViewOptions: readonly ("show-bookmarks" | "show-urls")[];
}

export type DropdownButtonAdvancedProps<Message> = DropdownAdvancedProps<Message>;
export type DropdownIconAdvancedProps<Message> = DropdownAdvancedProps<Message>;

interface AdvancedItem {
  readonly addon?: string;
  readonly icon?: keyof typeof iconPaths;
  readonly id: string;
  readonly label: string;
  readonly status?: "offline" | "online";
  readonly submenu?: DropdownAdvancedSubmenu;
}

const iconPaths = {
  back: "M20 12H4m0 0 6 6m-6-6 6-6",
  code: "m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18",
  copy: "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
  cube: "M20.5 7.278 12 12m0 0L3.5 7.278M12 12v9.5m9-5.441V7.942c0-.343 0-.514-.05-.667a1 1 0 0 0-.215-.364c-.109-.119-.258-.202-.558-.368l-7.4-4.111c-.284-.158-.425-.237-.575-.267a1 1 0 0 0-.403 0c-.15.03-.292.11-.576.267l-7.4 4.11c-.3.167-.45.25-.558.369a1 1 0 0 0-.215.364C3 7.428 3 7.599 3 7.942v8.117c0 .342 0 .514.05.666a1 1 0 0 0 .215.364c.109.119.258.202.558.368l7.4 4.111c.284.158.425.237.576.268.133.027.27.027.402 0 .15-.031.292-.11.576-.268l7.4-4.11c.3-.167.45-.25.558-.369a.999.999 0 0 0 .215-.364c.05-.152.05-.324.05-.666Z",
  download:
    "M21 15v1.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V15m14-5-5 5m0 0-5-5m5 5V3",
  edit: "m21 18-1 1.094A2.71 2.71 0 0 1 18 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 0 0-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 0 0-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 0 0-.24.578c-.055.23-.055.475-.055.965V20Z",
  forward: "M4 12h16m0 0-6-6m6 6-6 6",
  reload:
    "M2 10s.121-.85 3.636-4.364A9 9 0 0 1 20.776 10M2 10V4m0 6h6m14 4s-.121.85-3.636 4.364A9 9 0 0 1 3.224 14M22 14v6m0-6h-6",
  scissors:
    "M20 4 8.5 15.5m0-7L20 20M6 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 12a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  star: "M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.502.502 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.498.498 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z",
} as const;

const mainItems: readonly AdvancedItem[] = [
  { icon: "back", id: "back", label: "Back" },
  { icon: "forward", id: "forward", label: "Forward" },
  { addon: "⌘R", icon: "reload", id: "reload", label: "Reload" },
  { icon: "edit", id: "edit-page", label: "Edit page" },
  { icon: "star", id: "add-favorites", label: "Add to favorites" },
];

const peopleItems: readonly AdvancedItem[] = [
  { id: "olivia", label: "Olivia Rhye", status: "online" },
  { id: "sienna", label: "Sienna Hewitt", status: "offline" },
];

const submenuItems: Readonly<
  Record<Exclude<DropdownAdvancedSubmenu, "none">, readonly AdvancedItem[]>
> = {
  developer: [
    { id: "view-source", label: "View source" },
    { id: "developer-tools", label: "Developer tools" },
    { id: "inspect-elements", label: "Inspect elements" },
  ],
  "more-tools": [
    { icon: "download", id: "save-as", label: "Save as", submenu: "save-as" },
    { addon: "⌘X", icon: "scissors", id: "cut", label: "Cut" },
    { addon: "⌘C", icon: "copy", id: "copy", label: "Copy" },
    { icon: "code", id: "developer", label: "Developer", submenu: "developer" },
  ],
  "save-as": [
    { id: "pdf", label: "PDF" },
    { id: "html", label: "HTML" },
    { id: "markdown", label: "Markdown" },
  ],
};

const svgIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
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
    [h.path([h.D(path)])],
  );

const check = <Message>(visible: boolean, h: HtmlBuilder<Message>): Html =>
  svgIcon(
    "M20 6 9 17l-5-5",
    `mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-brand-primary ${visible ? "" : "invisible"}`,
    h,
  );

const chevron = <Message>(direction: "down" | "right", h: HtmlBuilder<Message>): Html =>
  svgIcon(
    direction === "down" ? "m6 9 6 6 6-6" : "m9 18 6-6-6-6",
    direction === "down"
      ? "size-4 shrink-0 stroke-[2.25px] text-current/70"
      : "ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary",
    h,
  );

const statusDot = <Message>(status: "offline" | "online", h: HtmlBuilder<Message>): Html =>
  h.span(
    [h.Class("mr-2 inline-flex shrink-0 items-center justify-center p-[5px]")],
    [
      h.span([
        h.Class(
          `inline-block size-1.5 rounded-full ${status === "online" ? "bg-fg-success-secondary" : "bg-utility-neutral-300"}`,
        ),
      ]),
    ],
  );

const visibleIds = (props: DropdownAdvancedProps<unknown>): readonly string[] => {
  const ids = [
    ...mainItems.map((item) => item.id),
    "show-bookmarks",
    "show-urls",
    ...peopleItems.map((item) => item.id),
    "more-tools",
  ];
  if (props.openSubmenu !== "none") {
    ids.push(...submenuItems[props.openSubmenu].map((item) => item.id));
  }
  return ids;
};

const focusMove = <Message>(props: DropdownAdvancedProps<Message>, id: string, key: string) => {
  const ids = visibleIds(props);
  const index = ids.indexOf(id);
  const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
  if (index === -1 || delta === 0) {
    return Option.none();
  }
  const next = ids[(index + delta + ids.length) % ids.length];
  return next === undefined
    ? Option.none()
    : Option.some({
        focusSelector: `[data-dropdown-advanced-item="${next}"]`,
        message: props.onFocus(next),
      });
};

const menuItem = <Message>(
  value: AdvancedItem,
  props: DropdownAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
  selected?: boolean,
): Html => {
  const opensSubmenu = value.submenu !== undefined;
  return h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role(selected === undefined ? "menuitem" : "menuitemcheckbox"),
      ...(selected === undefined ? [] : [h.AriaChecked(selected)]),
      h.Tabindex(props.focusedId === value.id ? 0 : -1),
      h.DataAttribute("dropdown-advanced-item", value.id),
      h.OnFocus(props.onFocus(value.id)),
      h.OnClick(
        opensSubmenu
          ? props.onSubmenuChange(value.submenu ?? "none")
          : value.id === "show-bookmarks" || value.id === "show-urls"
            ? props.onViewOptionToggle(value.id)
            : props.onSelect(value.id),
      ),
      h.OnKeyDownFocus((key) => focusMove(props, value.id, key)),
      h.OnKeyDownPreventDefault((key) => {
        if (key === "Escape") {
          return Option.some(props.onClose);
        }
        if (key === "ArrowRight" && value.submenu !== undefined) {
          return Option.some(props.onSubmenuChange(value.submenu));
        }
        return Option.none();
      }),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${props.focusedId === value.id && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""} ${opensSubmenu ? "pr-1.5" : ""}`,
          ),
        ],
        [
          ...(selected === undefined ? [] : [check(selected, h)]),
          ...(value.icon === undefined
            ? []
            : [
                svgIcon(
                  iconPaths[value.icon],
                  "mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary",
                  h,
                ),
              ]),
          ...(value.status === undefined ? [] : [statusDot(value.status, h)]),
          h.span(
            [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
            [value.label],
          ),
          ...(value.addon === undefined
            ? []
            : [
                h.span(
                  [h.Class("ml-1 shrink-0 pr-1 text-xs font-medium text-text-quaternary")],
                  [value.addon],
                ),
              ]),
          ...(opensSubmenu ? [chevron("right", h)] : []),
        ],
      ),
    ],
  );
};

const separator = <Message>(h: HtmlBuilder<Message>): Html =>
  h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")]);

const submenu = <Message>(
  id: Exclude<DropdownAdvancedSubmenu, "none">,
  props: DropdownAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `${id === "more-tools" ? (props.openSubmenu === "none" ? "hidden" : "") : props.openSubmenu === id ? "" : "hidden"} absolute z-30 w-50 overflow-auto rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt ${id === "more-tools" ? "bottom-1 left-[calc(100%+0.25rem)]" : "bottom-1 left-[calc(200%+0.5rem)]"}`,
      ),
      h.Role("menu"),
    ],
    submenuItems[id].flatMap((value, index) => [
      ...(id === "more-tools" && index === 3 ? [separator(h)] : []),
      menuItem(value, props, h),
    ]),
  );

const trigger = <Message>(
  variant: "button" | "icon",
  props: DropdownAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  variant === "button"
    ? h.button(
        [
          h.Class(
            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [h.span([h.Class("px-0.5")], ["Actions"]), chevron("down", h)],
      )
    : h.button(
        [
          h.Class(
            `cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2 ${props.isOpen ? "outline-2 outline-offset-2" : ""}`,
          ),
          h.Type("button"),
          h.AriaLabel("Open menu"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [
          svgIcon(
            "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
            "size-5 transition-inherit-all",
            h,
          ),
        ],
      );

const renderAdvanced = <Message>(
  props: DropdownAdvancedProps<Message>,
  variant: "button" | "icon",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      trigger(variant, props, h),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full z-20 mt-2 w-60 origin-top-right overflow-visible rounded-lg bg-bg-primary py-1 shadow-lg ring-1 ring-border-secondary-alt ${variant === "icon" ? "left-[-10.75rem]" : "right-0"}`,
          ),
          h.Role("menu"),
        ],
        [
          ...mainItems.map((value) => menuItem(value, props, h)),
          separator(h),
          ...(["show-bookmarks", "show-urls"] as const).map((id) =>
            menuItem(
              { id, label: id === "show-bookmarks" ? "Show bookmarks" : "Show full URLs" },
              props,
              h,
              props.selectedViewOptions.includes(id),
            ),
          ),
          separator(h),
          ...peopleItems.map((value) => menuItem(value, props, h)),
          separator(h),
          menuItem(
            { icon: "cube", id: "more-tools", label: "More tools", submenu: "more-tools" },
            props,
            h,
          ),
          submenu("more-tools", props, h),
          submenu("save-as", props, h),
          submenu("developer", props, h),
        ],
      ),
    ],
  );

export const dropdownButtonAdvanced = <Message>(
  props: DropdownButtonAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderAdvanced(props, "button", h);

export const dropdownIconAdvanced = <Message>(
  props: DropdownIconAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderAdvanced(props, "icon", h);
