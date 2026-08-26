/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The exact nested menu remains a controlled hierarchy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  contextMenuItem,
  contextMenuRoot,
  menuSurface,
  separator,
} from "../internal/context-menu-primitives.ts";
import type { ContextMenuBehavior, ContextMenuItem } from "../internal/context-menu-primitives.ts";

export type DropdownContextMenuAdvancedSubmenu = "developer" | "more-tools" | "none" | "save-as";

export interface DropdownContextMenuAdvancedProps<Message> extends ContextMenuBehavior<
  Message,
  DropdownContextMenuAdvancedSubmenu
> {
  readonly onViewOptionToggle: (id: "show-bookmarks" | "show-urls") => NoInfer<Message>;
  readonly openSubmenu: DropdownContextMenuAdvancedSubmenu;
  readonly selectedViewOptions: readonly ("show-bookmarks" | "show-urls")[];
}

const paths = {
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

const main: readonly ContextMenuItem<DropdownContextMenuAdvancedSubmenu>[] = [
  { iconPath: paths.back, id: "back", label: "Back" },
  { iconPath: paths.forward, id: "forward", label: "Forward" },
  { addon: "⌘R", iconPath: paths.reload, id: "reload", label: "Reload" },
  { iconPath: paths.edit, id: "edit-page", label: "Edit page" },
  { iconPath: paths.star, id: "add-favorites", label: "Add to favorites" },
];
const people: readonly ContextMenuItem<DropdownContextMenuAdvancedSubmenu>[] = [
  { id: "olivia", label: "Olivia Rhye", status: "online" },
  { id: "sienna", label: "Sienna Hewitt", status: "offline" },
];
const nested: Readonly<
  Record<
    Exclude<DropdownContextMenuAdvancedSubmenu, "none">,
    readonly ContextMenuItem<DropdownContextMenuAdvancedSubmenu>[]
  >
> = {
  developer: [
    { id: "view-source", label: "View source" },
    { id: "developer-tools", label: "Developer tools" },
    { id: "inspect-elements", label: "Inspect elements" },
  ],
  "more-tools": [
    { iconPath: paths.download, id: "save-as", label: "Save as", submenu: "save-as" },
    { addon: "⌘X", iconPath: paths.scissors, id: "cut", label: "Cut" },
    { addon: "⌘C", iconPath: paths.copy, id: "copy", label: "Copy" },
    { iconPath: paths.code, id: "developer", label: "Developer", submenu: "developer" },
  ],
  "save-as": [
    { id: "pdf", label: "PDF" },
    { id: "html", label: "HTML" },
    { id: "markdown", label: "Markdown" },
  ],
};

export const dropdownContextMenuAdvanced = <Message>(
  props: DropdownContextMenuAdvancedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const view: readonly ContextMenuItem<DropdownContextMenuAdvancedSubmenu>[] = [
    {
      checked: props.selectedViewOptions.includes("show-bookmarks"),
      id: "show-bookmarks",
      label: "Show bookmarks",
    },
    {
      checked: props.selectedViewOptions.includes("show-urls"),
      id: "show-urls",
      label: "Show full URLs",
    },
  ];
  const visibleIds = [
    ...main,
    ...view,
    ...people,
    { id: "more-tools", label: "More tools" },
    ...(props.openSubmenu === "none" ? [] : nested[props.openSubmenu]),
  ].map((item) => item.id);
  const behavior: ContextMenuBehavior<Message, DropdownContextMenuAdvancedSubmenu> = {
    ...props,
    onSelect: (id) =>
      id === "show-bookmarks" || id === "show-urls"
        ? props.onViewOptionToggle(id)
        : props.onSelect(id),
  };
  const moreTools: ContextMenuItem<DropdownContextMenuAdvancedSubmenu> = {
    expanded: props.openSubmenu !== "none",
    iconPath: paths.cube,
    id: "more-tools",
    label: "More tools",
    submenu: "more-tools",
  };
  const moreToolItems = nested["more-tools"].map((item) =>
    item.submenu === undefined ? item : { ...item, expanded: props.openSubmenu === item.submenu },
  );
  const mainMenu = menuSurface(
    [
      ...main.map((item) => contextMenuItem(item, visibleIds, behavior, h)),
      separator(h),
      ...view.map((item) => contextMenuItem(item, visibleIds, behavior, h)),
      separator(h),
      ...people.map((item) => contextMenuItem(item, visibleIds, behavior, h)),
      separator(h),
      contextMenuItem(moreTools, visibleIds, behavior, h),
    ],
    "relative w-60",
    h,
  );
  const menu = h.div(
    [h.Class("relative")],
    [
      mainMenu,
      ...(props.openSubmenu === "none"
        ? []
        : [
            menuSurface(
              moreToolItems.flatMap((item, index) => [
                ...(index === 3 ? [separator(h)] : []),
                contextMenuItem(item, visibleIds, behavior, h),
              ]),
              "absolute bottom-1 left-[calc(100%+0.25rem)] w-50",
              h,
            ),
          ]),
      ...(props.openSubmenu === "save-as" || props.openSubmenu === "developer"
        ? [
            menuSurface(
              nested[props.openSubmenu].map((item) =>
                contextMenuItem(item, visibleIds, behavior, h),
              ),
              "absolute bottom-1 left-[calc(200%+0.5rem)] w-50",
              h,
            ),
          ]
        : []),
    ],
  );
  return contextMenuRoot(behavior, menu, h);
};
