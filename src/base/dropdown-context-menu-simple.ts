/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The exact Untitled sections share the checked-in Dropdown anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  contextMenuItem,
  contextMenuRoot,
  menuSurface,
  separator,
} from "../internal/context-menu-primitives.ts";
import type { ContextMenuBehavior, ContextMenuItem } from "../internal/context-menu-primitives.ts";

export interface DropdownContextMenuSimpleProps<Message> extends ContextMenuBehavior<
  Message,
  "details"
> {
  readonly isSubmenuOpen: boolean;
}

const sections: readonly (readonly ContextMenuItem<"details">[])[] = [
  [
    { addon: "⌘X", id: "cut", label: "Cut" },
    { addon: "⌘C", id: "copy", label: "Copy" },
    { addon: "⌘V", id: "paste", label: "Paste" },
  ],
  [
    { id: "edit", label: "Edit" },
    { id: "duplicate", label: "Duplicate" },
    { id: "delete", label: "Delete" },
  ],
  [{ id: "view-details", label: "View details", submenu: "details" }],
];
const details: readonly ContextMenuItem<"details">[] = [
  { id: "share", label: "Share" },
  { id: "save-as", label: "Save as" },
  { id: "archive", label: "Archive" },
];

export const dropdownContextMenuSimple = <Message>(
  props: DropdownContextMenuSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const visibleIds = props.isSubmenuOpen
    ? [...sections.flat().map((item) => item.id), ...details.map((item) => item.id)]
    : sections.flat().map((item) => item.id);
  const renderedSections = sections.map((section) =>
    section.map((item) =>
      item.id === "view-details" ? { ...item, expanded: props.isSubmenuOpen } : item,
    ),
  );
  const main = menuSurface(
    renderedSections.flatMap((section, index) => [
      ...section.map((item) => contextMenuItem(item, visibleIds, props, h)),
      ...(index === renderedSections.length - 1 ? [] : [separator(h)]),
    ]),
    "relative w-54",
    h,
  );
  const menu = h.div(
    [h.Class("relative")],
    [
      main,
      ...(props.isSubmenuOpen
        ? [
            menuSurface(
              details.map((item) => contextMenuItem(item, visibleIds, props, h)),
              "absolute top-[13.75rem] left-[calc(100%+0.25rem)] w-50",
              h,
            ),
          ]
        : []),
    ],
  );
  return contextMenuRoot(props, menu, h);
};
