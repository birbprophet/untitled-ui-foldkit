/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary, mps/imperative-loops, unicorn/no-nested-ternary -- Untitled's shared Dropdown primitive needs explicit roving focus and native context-menu event handling. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContextMenuItem<Submenu extends string = string> {
  readonly addon?: string;
  readonly checked?: boolean;
  readonly expanded?: boolean;
  readonly iconPath?: string;
  readonly id: string;
  readonly label: string;
  readonly status?: "offline" | "online";
  readonly submenu?: Submenu;
}

export interface ContextMenuBehavior<Message, Submenu extends string = string> {
  readonly focusedId: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onOpen: NoInfer<Message>;
  readonly onPosition: (x: number, y: number) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onSubmenuChange: (submenu: Submenu) => NoInfer<Message>;
  readonly x: number;
  readonly y: number;
}

export const contextMenuSelector = (menuId: string, itemId: string): string =>
  `[data-context-menu-id="${menuId}"][data-context-menu-item="${itemId}"]`;

export const svgIcon = <Message>(path: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const check = <Message>(visible: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        `mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-brand-primary ${visible ? "" : "invisible"}`,
      ),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M20 6 9 17l-5-5")])],
  );

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
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

export const separator = <Message>(h: HtmlBuilder<Message>): Html =>
  h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")]);

export const contextTrigger = <Message, Submenu extends string>(
  props: ContextMenuBehavior<Message, Submenu>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel("Open context menu"),
      h.AriaHasPopup("menu"),
      h.AriaExpanded(props.isOpen),
      h.Class(
        "flex h-40 w-full max-w-xs cursor-default items-center justify-center rounded-xl border border-dashed border-secondary bg-primary px-6 text-center text-sm text-tertiary outline-focus-ring select-none focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Type("button"),
      h.DataAttribute("context-menu-trigger", props.id),
      h.OnPointerDown((_pointerType, button, _screenX, _screenY, _time, clientX, clientY) =>
        button === 2 ? Option.some(props.onPosition(clientX, clientY)) : Option.none(),
      ),
      h.OnContextMenu(props.onOpen),
      h.OnKeyDownPreventDefault((key, modifiers) =>
        key === "ContextMenu" || (key === "F10" && modifiers.shiftKey)
          ? Option.some(props.onOpen)
          : Option.none(),
      ),
    ],
    ["Right-click anywhere in this area"],
  );

const moveFocus = <Message, Submenu extends string>(
  ids: readonly string[],
  props: ContextMenuBehavior<Message, Submenu>,
  currentId: string,
  key: string,
) => {
  const index = ids.indexOf(currentId);
  const next =
    key === "Home"
      ? ids.at(0)
      : key === "End"
        ? ids.at(-1)
        : key === "ArrowDown"
          ? ids[(index + 1 + ids.length) % ids.length]
          : key === "ArrowUp"
            ? ids[(index - 1 + ids.length) % ids.length]
            : undefined;
  return next === undefined
    ? Option.none()
    : Option.some({
        focusSelector: contextMenuSelector(props.id, next),
        message: props.onFocus(next),
      });
};

export const contextMenuItem = <Message, Submenu extends string>(
  item: ContextMenuItem<Submenu>,
  visibleIds: readonly string[],
  props: ContextMenuBehavior<Message, Submenu>,
  h: HtmlBuilder<Message>,
): Html => {
  const isCheckbox = item.checked !== undefined;
  const opensSubmenu = item.submenu !== undefined;
  return h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role(isCheckbox ? "menuitemcheckbox" : "menuitem"),
      ...(isCheckbox ? [h.AriaChecked(item.checked ?? false)] : []),
      ...(opensSubmenu ? [h.AriaHasPopup("menu"), h.AriaExpanded(item.expanded ?? false)] : []),
      h.Tabindex(props.focusedId === item.id ? 0 : -1),
      h.DataAttribute("context-menu-id", props.id),
      h.DataAttribute("context-menu-item", item.id),
      ...(item.submenu === undefined && !isCheckbox
        ? [
            h.OnClick(props.onSelect(item.id), {
              focusSelector: `[data-context-menu-trigger="${props.id}"]`,
            }),
          ]
        : [
            h.OnClick(
              item.submenu === undefined
                ? props.onSelect(item.id)
                : props.onSubmenuChange(item.submenu),
            ),
          ]),
      ...(item.submenu === undefined ? [] : [h.OnMouseEnter(props.onSubmenuChange(item.submenu))]),
      h.OnKeyDownFocus((key) => {
        if (key === "Escape") {
          return Option.some({
            focusSelector: `[data-context-menu-trigger="${props.id}"]`,
            message: props.onClose,
          });
        }
        return moveFocus(visibleIds, props, item.id, key);
      }),
      h.OnKeyDownPreventDefault((key) => {
        if (key === "Escape") {
          return Option.some(props.onClose);
        }
        if (key === "ArrowRight" && item.submenu !== undefined) {
          return Option.some(props.onSubmenuChange(item.submenu));
        }
        return Option.none();
      }),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${opensSubmenu ? "pr-1.5" : ""}`,
          ),
        ],
        [
          ...(isCheckbox ? [check(item.checked ?? false, h)] : []),
          ...(item.iconPath === undefined ? [] : [svgIcon(item.iconPath, h)]),
          ...(item.status === undefined ? [] : [statusDot(item.status, h)]),
          h.span(
            [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
            [item.label],
          ),
          ...(item.addon === undefined
            ? []
            : [
                h.span(
                  [h.Class("ml-1 shrink-0 pr-1 text-xs font-medium text-text-quaternary")],
                  [item.addon],
                ),
              ]),
          ...(opensSubmenu ? [chevronRight(h)] : []),
        ],
      ),
    ],
  );
};

export const menuSurface = <Message>(
  items: readonly Html[],
  className: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt ${className}`,
      ),
      h.Role("menu"),
    ],
    [h.div([h.Class("h-min overflow-y-auto py-1 outline-none select-none")], items)],
  );

export const contextMenuRoot = <Message, Submenu extends string>(
  props: ContextMenuBehavior<Message, Submenu>,
  menu: Html,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative w-full max-w-xs")],
    [
      contextTrigger(props, h),
      ...(props.isOpen
        ? [
            h.div([h.AriaHidden(true), h.Class("fixed inset-0 z-10"), h.OnClick(props.onClose)]),
            h.div(
              [h.Class("fixed z-20"), h.Style({ left: `${props.x}px`, top: `${props.y}px` })],
              [menu],
            ),
          ]
        : []),
    ],
  );
